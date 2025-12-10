import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { CloudUpload, CheckCircle, Error } from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';
import githubApi from '../services/githubApi';

const BulkUpload = () => {
  const { selectedRepo, setError } = useApp();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!selectedRepo) {
      setError('Please select a repository first');
      return;
    }

    try {
      const text = await file.text();
      const issues = JSON.parse(text);

      if (!Array.isArray(issues)) {
        setError('JSON file must contain an array of issues');
        return;
      }

      setUploading(true);
      setError(null);
      setResults(null);
      setProgress(0);

      const [owner, repo] = selectedRepo.full_name.split('/');
      const totalIssues = issues.length;
      const uploadResults = [];

      for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];
        try {
          const result = await githubApi.createIssue(owner, repo, issue);
          uploadResults.push({ success: true, issue: result, data: issue });
        } catch (err) {
          uploadResults.push({ 
            success: false, 
            error: err.message, 
            data: issue 
          });
        }
        setProgress(((i + 1) / totalIssues) * 100);
      }

      setResults(uploadResults);
    } catch (err) {
      setError('Failed to process file: ' + err.message);
    } finally {
      setUploading(false);
      event.target.value = null; // Reset file input
    }
  };

  const getSuccessCount = () => {
    return results ? results.filter(r => r.success).length : 0;
  };

  const getFailureCount = () => {
    return results ? results.filter(r => !r.success).length : 0;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Bulk Upload Issues
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Upload a JSON file containing an array of issues. Each issue should have:
        <br />
        <strong>title</strong> (required), <strong>body</strong>, <strong>labels</strong> (array), 
        <strong>assignees</strong> (array)
        <br />
        <br />
        Example:
        <pre style={{ fontSize: '0.85em', marginTop: 8 }}>
{`[
  {
    "title": "Bug in login",
    "body": "Description here",
    "labels": ["bug", "priority-high"]
  }
]`}
        </pre>
      </Alert>

      {!selectedRepo && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please select a repository first
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <input
          accept=".json"
          style={{ display: 'none' }}
          id="bulk-upload-file"
          type="file"
          onChange={handleFileUpload}
          disabled={!selectedRepo || uploading}
        />
        <label htmlFor="bulk-upload-file">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUpload />}
            disabled={!selectedRepo || uploading}
            size="large"
          >
            Select JSON File
          </Button>
        </label>
      </Box>

      {uploading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Uploading issues... {Math.round(progress)}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {results && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Upload Results
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip
              icon={<CheckCircle />}
              label={`${getSuccessCount()} Successful`}
              color="success"
            />
            <Chip
              icon={<Error />}
              label={`${getFailureCount()} Failed`}
              color="error"
            />
          </Box>

          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {results.map((result, index) => (
              <ListItem key={index}>
                {result.success ? (
                  <CheckCircle color="success" sx={{ mr: 2 }} />
                ) : (
                  <Error color="error" sx={{ mr: 2 }} />
                )}
                <ListItemText
                  primary={result.data.title}
                  secondary={
                    result.success
                      ? `Created as issue #${result.issue.number}`
                      : `Error: ${result.error}`
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default BulkUpload;
