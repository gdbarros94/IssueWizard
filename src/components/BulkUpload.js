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
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import githubApi from '../services/githubApi';

const BulkUpload = () => {
  const { t } = useTranslation();
  const { selectedRepo, setError } = useApp();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [attempted, setAttempted] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!selectedRepo) {
      setError(t('bulkUpload.errorNoRepo'));
      return;
    }

    try {
      const text = await file.text();
      
      let issues;
      try {
        issues = JSON.parse(text);
      } catch (parseError) {
        // Attempt to auto-repair common case: unescaped newlines inside "description" strings
        try {
          const repairRegex = /("description"\s*:\s*")([\s\S]*?)("\s*,\s*\n\s*"labels")/g;
          const repaired = text.replace(repairRegex, (m, p1, p2, p3) => {
            const inner = p2.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n');
            return p1 + inner + p3;
          });

          issues = JSON.parse(repaired);
        } catch (repairError) {
          setError(`${t('bulkUpload.errorParse')}: ${parseError.message}`);
          return;
        }
      }

      if (!Array.isArray(issues)) {
        setError(t('bulkUpload.errorArray'));
        return;
      }

      // normalize: support 'description' field by mapping it to 'body' for GitHub API
      issues = issues.map((it) => {
        if (it.description && !it.body) {
          return { ...it, body: it.description };
        }
        return it;
      });

      setAttempted(true);
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
      setError(t('bulkUpload.errorProcess', { error: err.message }));
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
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
        {t('bulkUpload.title')}
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        {t('bulkUpload.instructions')}
        <br />
        <strong>{t('bulkUpload.requiredFields')}</strong>
        <br />
        <br />
        {t('bulkUpload.example')}
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
          {t('bulkUpload.selectRepo')}
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
            {t('bulkUpload.selectFile')}
          </Button>
        </label>
      </Box>

      {uploading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            {t('bulkUpload.uploading', { progress: Math.round(progress) })}
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {results && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {t('bulkUpload.results')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip
              icon={<CheckCircle />}
              label={t('bulkUpload.successful', { count: getSuccessCount() })}
              color="success"
            />
            <Chip
              icon={<Error />}
              label={t('bulkUpload.failed', { count: getFailureCount() })}
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
                      ? t('bulkUpload.createdAs', { number: result.issue.number })
                      : t('bulkUpload.error', { error: result.error })
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {!uploading && attempted && (!results || results.length === 0) && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="warning">{t('bulkUpload.noFeedback')}</Alert>
        </Box>
      )}
    </Paper>
  );
};

export default BulkUpload;
