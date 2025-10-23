const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { getMachineModel } = require('../models/Machine');
const AnalysisReport = require('../models/AnalysisReport');

class MLController {
  constructor() {
    this.mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';
  }

  async analyzeCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Extract machine info from filename
      // Expected format: MachineName_YYYY-MM-DD_to_YYYY-MM-DD_ai_analysis.csv
      const filename = req.file.originalname;
      let machineThresholds = null;
      let machineName = 'Unknown';
      let machineId = null;
      
      // Parse machine name from filename
      const nameParts = filename.split('_');
      if (nameParts.length > 0) {
        machineName = nameParts[0].replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
        
        // Fetch machine from database
        const MachineModel = getMachineModel();
        const dbType = process.env.DB_TYPE || 'mongodb';
        
        let machine;
        try {
          if (dbType === 'mongodb') {
            machine = await MachineModel.findOne({ 
              name: new RegExp(`^${machineName}$`, 'i') 
            }).lean();
          } else {
            const machineData = await MachineModel.findOne({ 
              where: { name: machineName } 
            });
            machine = machineData ? machineData.toJSON() : null;
          }
          
          if (machine) {
            machineId = machine._id || machine.id;
            machineThresholds = machine.thresholds;
            console.log(`✓ Machine found: ${machineName} (ID: ${machineId})`);
            console.log(`✓ Using machine-specific thresholds:`, machineThresholds);
          } else {
            // Machine not found - return error
            console.error(`✗ Machine not found in database: ${machineName}`);
            
            // Clean up uploaded file
            try {
              fs.unlinkSync(req.file.path);
            } catch (err) {
              console.error('Error deleting temp file:', err.message);
            }
            
            return res.status(404).json({
              success: false,
              message: `Machine "${machineName}" not found in database`,
              error: 'Please ensure the CSV filename starts with the exact machine name from your dashboard',
              hint: 'Download the CSV from the machine details page to ensure correct naming'
            });
          }
          
          // Validate thresholds exist
          if (!machineThresholds || !machineThresholds.temperature || !machineThresholds.vibration || !machineThresholds.current) {
            console.error(`✗ Machine ${machineName} has incomplete threshold configuration`);
            
            // Clean up uploaded file
            try {
              fs.unlinkSync(req.file.path);
            } catch (err) {
              console.error('Error deleting temp file:', err.message);
            }
            
            return res.status(400).json({
              success: false,
              message: `Machine "${machineName}" has incomplete threshold configuration`,
              error: 'Please configure thresholds for this machine in the dashboard',
              hint: 'Go to Manage Machines → Edit → Set threshold values'
            });
          }
        } catch (err) {
          console.error('Error fetching machine from database:', err.message);
          
          // Clean up uploaded file
          try {
            fs.unlinkSync(req.file.path);
          } catch (cleanupErr) {
            console.error('Error deleting temp file:', cleanupErr.message);
          }
          
          return res.status(500).json({
            success: false,
            message: 'Database error while fetching machine information',
            error: err.message
          });
        }
      } else {
        // Invalid filename format
        console.error(`✗ Invalid filename format: ${filename}`);
        
        // Clean up uploaded file
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.error('Error deleting temp file:', err.message);
        }
        
        return res.status(400).json({
          success: false,
          message: 'Invalid CSV filename format',
          error: 'Filename must start with machine name (e.g., MachineName_2024-01-01_to_2024-01-31_ai_analysis.csv)',
          hint: 'Download the CSV from the machine details page to ensure correct naming'
        });
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
        contentType: 'text/csv'
      });
      
      // Always add machine context (now guaranteed to exist)
      formData.append('thresholds', JSON.stringify(machineThresholds));
      formData.append('machine_name', machineName);
      formData.append('machine_id', machineId.toString());

      const response = await axios.post(
        `${this.mlServiceUrl}/analyze`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000
        }
      );

      // Clean up uploaded file
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error deleting temp file:', err.message);
      }

      // Save report to database if analysis was successful
      if (response.data.success && machineId) {
        try {
          const reportId = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          const reportData = {
            reportId,
            machineId,
            machineName: response.data.overall_health.machine_name || machineName,
            healthScore: response.data.overall_health.score,
            status: response.data.overall_health.status,
            totalReadings: response.data.overall_health.total_readings,
            criticalEvents: response.data.summary.critical_events,
            warningEvents: response.data.summary.total_stress_events - response.data.summary.critical_events,
            anomaliesDetected: response.data.summary.anomalies_detected,
            thresholds: response.data.machine_thresholds,
            trends: response.data.trends,
            recommendations: response.data.recommendations,
            stressEvents: response.data.stress_events.slice(0, 50), // Store first 50 events
            createdBy: req.user?._id || req.user?.id
          };
          
          const savedReport = await AnalysisReport.create(reportData);
          console.log(`✓ Report saved to database: ${reportId}`);
          
          // Add report ID to response
          response.data.reportId = reportId;
          response.data.savedToDatabase = true;
        } catch (dbError) {
          console.error('Error saving report to database:', dbError.message);
          // Don't fail the request if database save fails
          response.data.savedToDatabase = false;
        }
      }

      return res.status(200).json(response.data);

    } catch (error) {
      // Clean up uploaded file on error
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.error('Error deleting temp file:', err.message);
        }
      }

      console.error('ML analysis error:', error.message);
      
      if (error.response) {
        return res.status(error.response.status).json(
          error.response.data
        );
      }

      return res.status(500).json({
        success: false,
        message: 'ML service error',
        error: error.message
      });
    }
  }

  async validateCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          valid: false,
          message: 'No file uploaded'
        });
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
        contentType: 'text/csv'
      });

      const response = await axios.post(
        `${this.mlServiceUrl}/validate-csv`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 10000
        }
      );

      // Clean up uploaded file
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error deleting temp file:', err.message);
      }

      return res.status(200).json(response.data);

    } catch (error) {
      // Clean up uploaded file on error
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.error('Error deleting temp file:', err.message);
        }
      }

      console.error('CSV validation error:', error.message);
      
      if (error.response) {
        return res.status(error.response.status).json(
          error.response.data
        );
      }

      return res.status(500).json({
        valid: false,
        message: 'Validation service error',
        error: error.message
      });
    }
  }

  async checkMLService(req, res) {
    try {
      const response = await axios.get(
        `${this.mlServiceUrl}/health`,
        { timeout: 5000 }
      );

      return res.status(200).json({
        available: true,
        ...response.data
      });

    } catch (error) {
      return res.status(503).json({
        available: false,
        message: 'ML service unavailable',
        error: error.message
      });
    }
  }
}

module.exports = new MLController();
