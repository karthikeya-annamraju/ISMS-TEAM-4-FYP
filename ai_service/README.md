# Python ML Service for IntelliSub

Standalone Flask service providing machine learning capabilities for churn prediction.

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run service
python app.py
```

Service will run on `http://localhost:5000`

## API Endpoints

### Train Model
**POST** `/api/train`
```json
{
  "csv_path": "/path/to/churn_data.csv"
}
```

Response:
```json
{
  "model_name": "churn_model_1234567890.pkl",
  "accuracy": 0.85,
  "data_size": 1000,
  "model_path": "/path/to/model"
}
```

### Predict Churn
**POST** `/api/predict`
```json
{
  "user_id": 123,
  "model_path": "/path/to/model.pkl"
}
```

Response:
```json
{
  "user_id": 123,
  "churn_probability": 0.72,
  "prediction": "Churn"
}
```

### Batch Predict
**POST** `/api/batch-predict`
```json
{
  "user_ids": [1, 2, 3, 4, 5]
}
```

### Health Check
**GET** `/api/health`
