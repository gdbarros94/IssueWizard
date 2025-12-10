import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import githubApi from '../services/githubApi';

const IssueEditor = () => {
  const { t } = useTranslation();
  const { issueNumber } = useParams();
  const { selectedRepo, setError } = useApp();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    labels: [],
    state: 'open',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedRepo) {
      loadLabels();
      if (issueNumber) {
        loadIssue();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRepo, issueNumber]);

  const loadLabels = async () => {
    try {
      const [owner, repo] = selectedRepo.full_name.split('/');
      const labels = await githubApi.getRepositoryLabels(owner, repo);
      setAvailableLabels(labels);
    } catch (err) {
      console.error('Failed to load labels:', err);
    }
  };

  const loadIssue = async () => {
    setLoading(true);
    try {
      const [owner, repo] = selectedRepo.full_name.split('/');
      const issue = await githubApi.getIssue(owner, repo, issueNumber);
      setFormData({
        title: issue.title,
        body: issue.body || '',
        labels: issue.labels.map(l => l.name),
        state: issue.state,
      });
    } catch (err) {
      setError(t('issueEditor.errorLoad', { error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError(t('issueEditor.titleRequired'));
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const [owner, repo] = selectedRepo.full_name.split('/');
      const issueData = {
        title: formData.title,
        body: formData.body,
        labels: formData.labels,
        state: formData.state,
      };

      if (issueNumber) {
        await githubApi.updateIssue(owner, repo, issueNumber, issueData);
      } else {
        await githubApi.createIssue(owner, repo, issueData);
      }
      navigate('/');
    } catch (err) {
      setError(t('issueEditor.errorSave', { error: err.message }));
    } finally {
      setSaving(false);
    }
  };

  if (!selectedRepo) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        {t('issueEditor.selectRepo')}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          {t('issueEditor.back')}
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        {issueNumber ? t('issueEditor.editTitle', { number: issueNumber }) : t('issueEditor.createTitle')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label={t('issueEditor.titleLabel')}
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label={t('issueEditor.descriptionLabel')}
          value={formData.body}
          onChange={(e) => handleChange('body', e.target.value)}
          multiline
          rows={6}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>{t('issueEditor.labelsLabel')}</InputLabel>
          <Select
            multiple
            value={formData.labels}
            onChange={(e) => handleChange('labels', e.target.value)}
            input={<OutlinedInput label={t('issueEditor.labelsLabel')} />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const label = availableLabels.find(l => l.name === value);
                  return (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      sx={{
                        backgroundColor: label ? `#${label.color}` : undefined,
                        color: '#fff',
                      }}
                    />
                  );
                })}
              </Box>
            )}
          >
            {availableLabels.map((label) => (
              <MenuItem key={label.id} value={label.name}>
                <Chip
                  label={label.name}
                  size="small"
                  sx={{
                    backgroundColor: `#${label.color}`,
                    color: '#fff',
                    mr: 1,
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {issueNumber && (
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('issueEditor.stateLabel')}</InputLabel>
            <Select
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              label={t('issueEditor.stateLabel')}
            >
              <MenuItem value="open">{t('issueEditor.stateOpen')}</MenuItem>
              <MenuItem value="closed">{t('issueEditor.stateClosed')}</MenuItem>
            </Select>
          </FormControl>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={saving}
          >
            {saving ? t('issueEditor.saving') : t('issueEditor.saveButton')}
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            {t('issueEditor.cancel')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default IssueEditor;
