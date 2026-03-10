import React, { useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

/**
 * AI Module Component - CSV Upload & Model Training
 * Allows admin to upload training datasets and train churn prediction model
 */
const AITrainingPanel = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/ai/train', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setError(null);
        setFile(null);
      } else {
        setError(data.message || 'Training failed');
      }
    } catch (err) {
      setError('Error uploading file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={20} /> Train Churn Prediction Model
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-sm text-gray-600">
              {file ? file.name : 'Click or drag CSV file here'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Expected columns: tenure, monthly_charges, total_charges, Churn</p>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Training Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader className="mr-2 animate-spin" size={16} /> Training...
            </>
          ) : (
            'Train Model'
          )}
        </Button>

        {/* Results */}
        {result && result.status === 'SUCCESS' && (
          <div className="bg-green-100 border border-green-400 rounded-lg p-4 space-y-2">
            <h3 className="font-bold text-green-700">✓ Model Trained Successfully</h3>
            <div className="text-sm text-green-600 space-y-1">
              <p>Model ID: {result.modelId}</p>
              <p>Model Name: {result.modelName}</p>
              <p>Accuracy: {(result.accuracy * 100).toFixed(2)}%</p>
              <p className="text-xs text-gray-600 mt-2">{result.message}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITrainingPanel;
