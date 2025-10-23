import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime

class MachineryHealthAnalyzer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.health_classifier = None
        self.anomaly_detector = None
        self.model_dir = os.path.join(os.path.dirname(__file__), 'models')
        
        if not os.path.exists(self.model_dir):
            os.makedirs(self.model_dir)
    
    def calculate_health_score(self, temp, vibration, current, thresholds):
        """Calculate accurate health score based on sensor readings and machine-specific thresholds
        
        Scoring logic:
        - Normal range (below warning): 100 points
        - Warning range: 50-99 points (linear decrease)
        - Critical range: 0-49 points (linear decrease)
        - Above critical: 0 points
        """
        if thresholds is None:
            raise ValueError('Thresholds are required. Machine-specific thresholds must be provided from database.')
        
        temp_score = 100
        vib_score = 100
        current_score = 100
        
        # Temperature scoring using custom thresholds
        temp_warn = thresholds['temperature']['warning']
        temp_crit = thresholds['temperature']['critical']
        
        if temp >= temp_crit:
            # Critical: 0-20 points based on how far above critical
            excess = temp - temp_crit
            temp_score = max(0, 20 - (excess / temp_crit * 20))
        elif temp >= temp_warn:
            # Warning: 50-99 points (linear decrease from warning to critical)
            ratio = (temp - temp_warn) / (temp_crit - temp_warn)
            temp_score = 99 - (ratio * 49)
        else:
            # Normal: 100 points
            temp_score = 100
        
        # Vibration scoring
        vib_warn = thresholds['vibration']['warning']
        vib_crit = thresholds['vibration']['critical']
        
        if vibration >= vib_crit:
            # Critical: 0-20 points
            excess = vibration - vib_crit
            vib_score = max(0, 20 - (excess / vib_crit * 20))
        elif vibration >= vib_warn:
            # Warning: 50-99 points
            ratio = (vibration - vib_warn) / (vib_crit - vib_warn)
            vib_score = 99 - (ratio * 49)
        else:
            # Normal: 100 points
            vib_score = 100
        
        # Current scoring
        curr_warn = thresholds['current']['warning']
        curr_crit = thresholds['current']['critical']
        
        if current >= curr_crit:
            # Critical: 0-20 points
            excess = current - curr_crit
            current_score = max(0, 20 - (excess / curr_crit * 20))
        elif current >= curr_warn:
            # Warning: 50-99 points
            ratio = (current - curr_warn) / (curr_crit - curr_warn)
            current_score = 99 - (ratio * 49)
        else:
            # Normal: 100 points
            current_score = 100
        
        # Overall score (weighted average)
        # Temperature and Vibration are more critical for machine health
        overall_score = (temp_score * 0.35 + vib_score * 0.40 + current_score * 0.25)
        
        return round(overall_score, 2)
    
    def determine_health_status(self, score):
        """Determine health status from score"""
        if score >= 85:
            return 'Excellent'
        elif score >= 70:
            return 'Good'
        elif score >= 50:
            return 'Fair'
        elif score >= 30:
            return 'Poor'
        else:
            return 'Critical'
    
    def analyze_stress_patterns(self, df, thresholds):
        """Analyze when machinery gets overstressed using machine-specific thresholds"""
        if thresholds is None:
            raise ValueError('Thresholds are required. Machine-specific thresholds must be provided from database.')
        
        stress_events = []
        
        for idx, row in df.iterrows():
            temp = row['temperature']
            vib = row['vibration']
            current = row['current']
            timestamp = row.get('timestamp', idx)
            
            stress_level = 'Normal'
            issues = []
            
            # Check for stress conditions using custom thresholds
            temp_warn = thresholds['temperature']['warning']
            temp_crit = thresholds['temperature']['critical']
            vib_warn = thresholds['vibration']['warning']
            vib_crit = thresholds['vibration']['critical']
            curr_warn = thresholds['current']['warning']
            curr_crit = thresholds['current']['critical']
            
            if temp > temp_crit:
                stress_level = 'Critical'
                issues.append(f'Temperature critically high ({temp:.1f}°C, threshold: {temp_crit}°C)')
            elif temp > temp_warn:
                stress_level = 'High' if stress_level != 'Critical' else stress_level
                issues.append(f'Temperature elevated ({temp:.1f}°C, threshold: {temp_warn}°C)')
            
            if vib > vib_crit:
                stress_level = 'Critical'
                issues.append(f'Vibration critically high ({vib:.1f} Hz, threshold: {vib_crit} Hz)')
            elif vib > vib_warn:
                stress_level = 'High' if stress_level != 'Critical' else stress_level
                issues.append(f'Vibration elevated ({vib:.1f} Hz, threshold: {vib_warn} Hz)')
            
            if current > curr_crit:
                stress_level = 'Critical'
                issues.append(f'Current critically high ({current:.1f} A, threshold: {curr_crit} A)')
            elif current > curr_warn:
                stress_level = 'High' if stress_level != 'Critical' else stress_level
                issues.append(f'Current elevated ({current:.1f} A, threshold: {curr_warn} A)')
            
            if stress_level != 'Normal':
                stress_events.append({
                    'timestamp': str(timestamp),
                    'stress_level': stress_level,
                    'issues': issues,
                    'temperature': temp,
                    'vibration': vib,
                    'current': current
                })
        
        return stress_events
    
    def detect_anomalies(self, df):
        """Detect anomalous patterns in the data"""
        features = df[['temperature', 'vibration', 'current']].values
        
        # Use Isolation Forest for anomaly detection
        iso_forest = IsolationForest(contamination=0.1, random_state=42)
        anomaly_labels = iso_forest.fit_predict(features)
        
        anomalies = []
        for idx, label in enumerate(anomaly_labels):
            if label == -1:  # Anomaly detected
                row = df.iloc[idx]
                anomalies.append({
                    'timestamp': str(row.get('timestamp', idx)),
                    'temperature': float(row['temperature']),
                    'vibration': float(row['vibration']),
                    'current': float(row['current']),
                    'reason': 'Unusual pattern detected'
                })
        
        return anomalies
    
    def calculate_trends(self, df):
        """Calculate trends in sensor readings"""
        trends = {}
        
        for column in ['temperature', 'vibration', 'current']:
            values = df[column].values
            if len(values) > 1:
                # Calculate linear trend
                x = np.arange(len(values))
                z = np.polyfit(x, values, 1)
                slope = z[0]
                
                if abs(slope) < 0.01:
                    trend = 'Stable'
                elif slope > 0:
                    trend = 'Increasing'
                else:
                    trend = 'Decreasing'
                
                trends[column] = {
                    'trend': trend,
                    'slope': round(float(slope), 4),
                    'average': round(float(np.mean(values)), 2),
                    'min': round(float(np.min(values)), 2),
                    'max': round(float(np.max(values)), 2),
                    'std': round(float(np.std(values)), 2)
                }
            else:
                trends[column] = {
                    'trend': 'Insufficient data',
                    'slope': 0,
                    'average': round(float(values[0]), 2),
                    'min': round(float(values[0]), 2),
                    'max': round(float(values[0]), 2),
                    'std': 0
                }
        
        return trends
    
    def generate_recommendations(self, overall_health, stress_events, trends, machine_name=None, thresholds=None):
        """Generate comprehensive maintenance recommendations with severity assessment based on machine-specific thresholds"""
        recommendations = []
        critical_count = len([e for e in stress_events if e['stress_level'] == 'Critical'])
        warning_count = len([e for e in stress_events if e['stress_level'] == 'High']) - critical_count
        
        machine_prefix = f"{machine_name}: " if machine_name else ""
        
        # Extract threshold values for recommendations
        if thresholds:
            temp_warn = thresholds['temperature']['warning']
            temp_crit = thresholds['temperature']['critical']
            vib_warn = thresholds['vibration']['warning']
            vib_crit = thresholds['vibration']['critical']
            curr_warn = thresholds['current']['warning']
            curr_crit = thresholds['current']['critical']
        else:
            temp_warn = temp_crit = vib_warn = vib_crit = curr_warn = curr_crit = None
        
        # Critical health assessment (score < 30)
        if overall_health['score'] < 30:
            recommendations.append({
                'priority': 'Critical',
                'action': f'{machine_prefix}IMMEDIATE SHUTDOWN REQUIRED - Stop machine operation immediately',
                'reason': f'Health score critically low ({overall_health["score"]}%). Machine poses safety risk and requires emergency repair before resuming operations.',
                'severity': 'CRITICAL'
            })
            recommendations.append({
                'priority': 'Critical',
                'action': 'Contact maintenance team for emergency repair',
                'reason': f'Multiple critical threshold violations detected ({critical_count} events). Do not operate until repairs are completed and verified.',
                'severity': 'CRITICAL'
            })
        elif overall_health['score'] < 50:
            recommendations.append({
                'priority': 'High',
                'action': f'{machine_prefix}Schedule urgent inspection and repair within 24 hours',
                'reason': f'Health score is low ({overall_health["score"]}%). Machine showing signs of significant wear or malfunction. Continued operation may lead to failure.',
                'severity': 'HIGH'
            })
            recommendations.append({
                'priority': 'High',
                'action': 'Arrange comprehensive diagnostic assessment',
                'reason': f'Detected {critical_count} critical and {warning_count} warning events. Multiple parameters exceeding safe operational thresholds.',
                'severity': 'HIGH'
            })
        elif overall_health['score'] < 70:
            recommendations.append({
                'priority': 'Medium',
                'action': f'{machine_prefix}Schedule preventive maintenance within 3-4 days',
                'reason': f'Health score indicates developing issues ({overall_health["score"]}%). Early intervention recommended to prevent deterioration.',
                'severity': 'MEDIUM'
            })
            if warning_count > 5:
                recommendations.append({
                    'priority': 'Medium',
                    'action': 'Monitor machine closely and reduce operational load',
                    'reason': f'{warning_count} warning-level events detected. Machine operating near threshold limits.',
                    'severity': 'MEDIUM'
                })
        
        # Critical stress events
        if critical_count > 5:
            recommendations.append({
                'priority': 'Critical',
                'action': f'{machine_prefix}Reduce operational load immediately',
                'reason': f'{critical_count} critical stress events detected - machine is being over-stressed',
                'severity': 'CRITICAL'
            })
        elif critical_count > 0:
            recommendations.append({
                'priority': 'High',
                'action': 'Monitor machine closely and reduce workload',
                'reason': f'{critical_count} critical events detected',
                'severity': 'HIGH'
            })
        
        # Frequent stress events
        if len(stress_events) > 20:
            recommendations.append({
                'priority': 'High',
                'action': 'Investigate root cause of frequent stress conditions',
                'reason': f'{len(stress_events)} stress events indicate systemic issues',
                'severity': 'HIGH'
            })
        
        # Temperature-specific recommendations
        temp_trend = trends['temperature']
        if thresholds and temp_trend['max'] >= temp_crit:
            recommendations.append({
                'priority': 'Critical',
                'action': 'Inspect cooling system and thermal management immediately',
                'reason': f'Temperature exceeded critical threshold (max: {temp_trend["max"]}°C, critical: {temp_crit}°C). Immediate cooling system inspection required.',
                'severity': 'CRITICAL'
            })
        elif thresholds and temp_trend['max'] >= temp_warn:
            recommendations.append({
                'priority': 'High',
                'action': 'Inspect cooling system and thermal management',
                'reason': f'Temperature approaching critical levels (max: {temp_trend["max"]}°C, warning: {temp_warn}°C, critical: {temp_crit}°C). Check cooling system efficiency.',
                'severity': 'HIGH'
            })
        elif temp_trend['trend'] == 'Increasing' and temp_trend['slope'] > 0.1:
            recommendations.append({
                'priority': 'Medium',
                'action': 'Monitor temperature trends closely',
                'reason': f'Temperature showing upward trend (current max: {temp_trend["max"]}°C). Monitor to ensure it stays below warning threshold of {temp_warn}°C.',
                'severity': 'MEDIUM'
            })
        
        # Vibration-specific recommendations
        vib_trend = trends['vibration']
        if thresholds and vib_trend['max'] >= vib_crit:
            recommendations.append({
                'priority': 'Critical',
                'action': 'Immediate mechanical inspection required',
                'reason': f'Vibration exceeded critical threshold (max: {vib_trend["max"]} Hz, critical: {vib_crit} Hz). Possible bearing failure, misalignment, or structural damage.',
                'severity': 'CRITICAL'
            })
        elif thresholds and vib_trend['max'] >= vib_warn:
            recommendations.append({
                'priority': 'High',
                'action': 'Inspect bearings, belts, and alignment',
                'reason': f'Vibration approaching critical levels (max: {vib_trend["max"]} Hz, warning: {vib_warn} Hz, critical: {vib_crit} Hz). Early sign of mechanical wear.',
                'severity': 'HIGH'
            })
        elif vib_trend['trend'] == 'Increasing' and vib_trend['slope'] > 0.05:
            recommendations.append({
                'priority': 'Medium',
                'action': 'Monitor vibration levels closely',
                'reason': f'Vibration showing upward trend (current max: {vib_trend["max"]} Hz). Monitor to ensure it stays below warning threshold of {vib_warn} Hz.',
                'severity': 'MEDIUM'
            })
        
        # Current-specific recommendations
        curr_trend = trends['current']
        if thresholds and curr_trend['max'] >= curr_crit:
            recommendations.append({
                'priority': 'Critical',
                'action': 'Check electrical system and motor condition immediately',
                'reason': f'Current exceeded critical threshold (max: {curr_trend["max"]} A, critical: {curr_crit} A). Possible motor overload or electrical fault.',
                'severity': 'CRITICAL'
            })
        elif thresholds and curr_trend['max'] >= curr_warn:
            recommendations.append({
                'priority': 'High',
                'action': 'Inspect electrical system and verify motor condition',
                'reason': f'Current approaching critical levels (max: {curr_trend["max"]} A, warning: {curr_warn} A, critical: {curr_crit} A). Check for electrical issues or increased load.',
                'severity': 'HIGH'
            })
        elif curr_trend['trend'] == 'Increasing' and curr_trend['slope'] > 0.1:
            recommendations.append({
                'priority': 'Medium',
                'action': 'Monitor current consumption and verify load conditions',
                'reason': f'Current showing upward trend (current max: {curr_trend["max"]} A). Monitor to ensure it stays below warning threshold of {curr_warn} A.',
                'severity': 'MEDIUM'
            })
        
        # Operational status recommendation for healthy machines
        if overall_health['score'] >= 85:
            recommendations.append({
                'priority': 'Low',
                'action': 'Continue normal operations with regular maintenance schedule',
                'reason': f'Machine operating in excellent condition ({overall_health["score"]}%). All parameters within normal ranges. Maintain current maintenance schedule.',
                'severity': 'LOW'
            })
        elif overall_health['score'] >= 70 and len(recommendations) == 0:
            recommendations.append({
                'priority': 'Low',
                'action': 'Machine is operating well - continue normal operations',
                'reason': f'Health score is good ({overall_health["score"]}%). Continue regular monitoring and follow standard maintenance procedures.',
                'severity': 'LOW'
            })
        
        # Sort by priority
        priority_order = {'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3}
        recommendations.sort(key=lambda x: priority_order.get(x['priority'], 4))
        
        return recommendations
    
    def analyze_csv(self, csv_path, thresholds=None, machine_name=None):
        """Main analysis function for CSV file with machine-specific thresholds"""
        try:
            # Validate thresholds are provided
            if thresholds is None:
                return {
                    'success': False,
                    'error': 'Machine-specific thresholds are required',
                    'message': 'Analysis cannot proceed without machine thresholds from database'
                }
            
            print(f'✓ Analyzing with machine-specific thresholds for {machine_name}:')
            print(f'  Temperature: Warning={thresholds["temperature"]["warning"]}°C, Critical={thresholds["temperature"]["critical"]}°C')
            print(f'  Vibration: Warning={thresholds["vibration"]["warning"]} Hz, Critical={thresholds["vibration"]["critical"]} Hz')
            print(f'  Current: Warning={thresholds["current"]["warning"]} A, Critical={thresholds["current"]["critical"]} A')
            
            # Read CSV
            df = pd.read_csv(csv_path)
            
            # Validate required columns
            required_columns = ['temperature', 'vibration', 'current']
            if not all(col in df.columns for col in required_columns):
                return {
                    'success': False,
                    'error': f'CSV must contain columns: {", ".join(required_columns)}'
                }
            
            # Calculate overall health with custom thresholds
            health_scores = []
            for _, row in df.iterrows():
                score = self.calculate_health_score(
                    row['temperature'],
                    row['vibration'],
                    row['current'],
                    thresholds=thresholds
                )
                health_scores.append(score)
            
            base_score = np.mean(health_scores)
            
            # Analyze stress patterns first to get event counts
            stress_events = self.analyze_stress_patterns(df, thresholds=thresholds)
            critical_count = len([e for e in stress_events if e['stress_level'] == 'Critical'])
            high_count = len([e for e in stress_events if e['stress_level'] == 'High'])
            
            # Apply penalties for stress events
            overall_score = base_score
            
            # Heavy penalty for critical events
            if critical_count > 0:
                # Each critical event reduces score significantly
                critical_penalty = min(critical_count * 3, 40)  # Max 40% penalty
                overall_score = overall_score - critical_penalty
            
            # Moderate penalty for high-level events
            if high_count > 0:
                high_penalty = min(high_count * 0.5, 15)  # Max 15% penalty
                overall_score = overall_score - high_penalty
            
            # Ensure score doesn't go below 0
            overall_score = max(0, overall_score)
            overall_status = self.determine_health_status(overall_score)
            
            # stress_events already calculated above
            
            # Detect anomalies
            anomalies = self.detect_anomalies(df)
            
            # Calculate trends
            trends = self.calculate_trends(df)
            
            # Overall health summary
            overall_health = {
                'score': round(overall_score, 2),
                'status': overall_status,
                'total_readings': len(df),
                'analysis_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'machine_name': machine_name or 'Unknown'
            }
            
            # Generate comprehensive recommendations
            recommendations = self.generate_recommendations(
                overall_health,
                stress_events,
                trends,
                machine_name=machine_name,
                thresholds=thresholds
            )
            
            # Compile comprehensive report with thresholds
            report = {
                'success': True,
                'overall_health': overall_health,
                'machine_thresholds': thresholds,  # Include thresholds used for analysis
                'stress_events': stress_events,
                'anomalies': anomalies,
                'trends': trends,
                'recommendations': recommendations,
                'summary': {
                    'total_stress_events': len(stress_events),
                    'critical_events': len([e for e in stress_events if e['stress_level'] == 'Critical']),
                    'anomalies_detected': len(anomalies),
                    'health_trend': self.get_health_trend(health_scores)
                }
            }
            
            print(f'✓ Analysis complete for {machine_name}')
            print(f'  Health Score: {overall_score:.2f}/100 ({overall_status})')
            print(f'  Stress Events: {len(stress_events)} (Critical: {len([e for e in stress_events if e["stress_level"] == "Critical"])})')
            print(f'  Anomalies: {len(anomalies)}')
            
            return report
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_health_trend(self, scores):
        """Determine overall health trend"""
        if len(scores) < 2:
            return 'Stable'
        
        first_half = np.mean(scores[:len(scores)//2])
        second_half = np.mean(scores[len(scores)//2:])
        
        diff = second_half - first_half
        
        if abs(diff) < 5:
            return 'Stable'
        elif diff > 0:
            return 'Improving'
        else:
            return 'Declining'

# Create global instance
analyzer = MachineryHealthAnalyzer()
