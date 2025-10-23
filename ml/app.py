from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime
import os
import json
import pandas as pd
from model import analyzer
from werkzeug.utils import secure_filename
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# CORS Configuration
allowed_origins = os.getenv('CORS_ORIGINS', 'http://localhost:8080').split(',')
CORS(app, origins=allowed_origins, supports_credentials=True)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'csv'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'ml',
        'message': 'ML Service is running',
        'analyzer': 'Machinery Health Analyzer'
    }), 200

@app.route('/analyze', methods=['POST'])
def analyze_machinery():
    try:
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Only CSV files are allowed'
            }), 400
        
        # Save file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Get machine-specific thresholds (REQUIRED)
        thresholds = None
        machine_name = None
        machine_id = None
        
        if 'thresholds' not in request.form:
            # Clean up file
            try:
                os.remove(filepath)
            except:
                pass
            
            return jsonify({
                'success': False,
                'error': 'Machine thresholds are required',
                'message': 'This CSV file must be downloaded from a specific machine in the dashboard'
            }), 400
        
        try:
            thresholds = json.loads(request.form['thresholds'])
            print(f'✓ Received machine-specific thresholds: {thresholds}')
        except Exception as e:
            # Clean up file
            try:
                os.remove(filepath)
            except:
                pass
            
            return jsonify({
                'success': False,
                'error': 'Invalid threshold format',
                'message': str(e)
            }), 400
        
        if 'machine_name' in request.form:
            machine_name = request.form['machine_name']
            print(f'✓ Analyzing for machine: {machine_name}')
        
        if 'machine_id' in request.form:
            machine_id = request.form['machine_id']
            print(f'✓ Machine ID: {machine_id}')
        
        # Analyze with machine-specific thresholds
        result = analyzer.analyze_csv(filepath, thresholds=thresholds, machine_name=machine_name)
        
        # Clean up uploaded file
        try:
            os.remove(filepath)
        except:
            pass
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/validate-csv', methods=['POST'])
def validate_csv():
    try:
        if 'file' not in request.files:
            return jsonify({
                'valid': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        if not allowed_file(file.filename):
            return jsonify({
                'valid': False,
                'error': 'Only CSV files are allowed'
            }), 400
        
        # Read and validate CSV
        df = pd.read_csv(file)
        
        required_columns = ['temperature', 'vibration', 'current']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            return jsonify({
                'valid': False,
                'error': f'Missing required columns: {", ".join(missing_columns)}',
                'found_columns': list(df.columns)
            }), 400
        
        return jsonify({
            'valid': True,
            'rows': len(df),
            'columns': list(df.columns)
        }), 200
        
    except Exception as e:
        return jsonify({
            'valid': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    logger.info(f'Starting ML Service on port {port}...')
    logger.info(f'Environment: {os.getenv("FLASK_ENV", "development")}')
    logger.info(f'CORS Origins: {allowed_origins}')
    
    app.run(host='0.0.0.0', port=port, debug=debug)
