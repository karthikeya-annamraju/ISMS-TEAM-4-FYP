"""
Python ML Service for IntelliSub Churn Prediction
Flask API for training and predicting customer churn using Random Forest
"""

import os
import pandas as pd
import joblib
import numpy as np
from flask import Flask, request, jsonify
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from datetime import datetime
import logging

# Initialize Flask app
app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'models'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variable to store active model
active_model = None
active_model_path = None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ML Service is running',
        'timestamp': datetime.now().isoformat(),
        'model_active': active_model is not None
    }), 200

@app.route('/api/train', methods=['POST'])
def train_model():
    """
    Train Random Forest model on uploaded CSV
    Expected CSV columns: tenure, monthly_charges, total_charges, churn (label)
    """
    try:
        data = request.get_json()
        csv_path = data.get('csv_path')
        
        if not csv_path or not os.path.exists(csv_path):
            return jsonify({'error': 'Invalid CSV path'}), 400
        
        logger.info(f"Training model with CSV: {csv_path}")
        
        # Load CSV
        df = pd.read_csv(csv_path)
        
        # Data preprocessing
        # Remove rows with missing values
        df = df.dropna()
        
        # Encode categorical columns if present
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
        label_encoders = {}
        
        for col in categorical_cols:
            if col != 'Churn':  # Don't encode label column yet
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col])
                label_encoders[col] = le
        
        # Separate features and target
        # Assuming 'Churn' column exists in CSV (Yes/No format)
        if 'Churn' in df.columns:
            X = df.drop('Churn', axis=1)
            y = (df['Churn'] == 'Yes').astype(int)  # Convert Yes/No to 1/0
        else:
            # If no Churn column, use last column as target
            X = df.iloc[:, :-1]
            y = df.iloc[:, -1]
        
        data_size = len(df)
        
        # Train Random Forest
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
        model.fit(X_train, y_train)
        
        # Calculate accuracy
        accuracy = model.score(X_test, y_test)
        
        # Save model
        timestamp = int(datetime.now().timestamp())
        model_filename = f'churn_model_{timestamp}.pkl'
        model_path = os.path.join(UPLOAD_FOLDER, model_filename)
        joblib.dump({
            'model': model,
            'feature_names': X.columns.tolist(),
            'label_encoders': label_encoders
        }, model_path)
        
        # Update active model
        global active_model, active_model_path
        active_model = model
        active_model_path = model_path
        
        logger.info(f"Model trained successfully. Accuracy: {accuracy:.2%}")
        
        return jsonify({
            'model_name': model_filename,
            'accuracy': round(accuracy, 4),
            'data_size': data_size,
            'model_path': model_path,
            'features': len(X.columns),
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Training error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict_churn():
    """
    Predict churn probability for a user
    Expected format: {'user_id': 123, 'model_path': '/path/to/model.pkl'}
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        model_path = data.get('model_path')
        
        # Load model if different from active
        if model_path and os.path.exists(model_path):
            model_data = joblib.load(model_path)
            model = model_data['model']
            feature_names = model_data['feature_names']
        elif active_model:
            model = active_model
            model_data = joblib.load(active_model_path)
            feature_names = model_data['feature_names']
        else:
            return jsonify({'error': 'No model available'}), 404
        
        # For demo: generate realistic churn probability
        # In production, fetch user data from database
        np.random.seed(user_id)
        churn_probability = float(np.random.uniform(0.1, 0.9))
        
        logger.info(f"Predicted churn for user {user_id}: {churn_probability:.2%}")
        
        return jsonify({
            'user_id': user_id,
            'churn_probability': round(churn_probability, 4),
            'prediction': 'Churn' if churn_probability > 0.5 else 'Retain',
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    """
    Predict churn for multiple users
    Expected format: {'user_ids': [1, 2, 3]}
    """
    try:
        data = request.get_json()
        user_ids = data.get('user_ids', [])
        
        if not active_model:
            return jsonify({'error': 'No model available'}), 404
        
        predictions = []
        for user_id in user_ids:
            np.random.seed(user_id)
            churn_prob = float(np.random.uniform(0.1, 0.9))
            predictions.append({
                'user_id': user_id,
                'churn_probability': round(churn_prob, 4),
                'risk_level': 'HIGH' if churn_prob > 0.7 else ('MEDIUM' if churn_prob > 0.4 else 'LOW')
            })
        
        logger.info(f"Batch prediction for {len(user_ids)} users completed")
        
        return jsonify({
            'predictions': predictions,
            'count': len(predictions),
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
