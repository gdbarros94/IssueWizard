import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import githubApi from '../services/githubApi';

const IssueDetail = () => {
  const { t } = useTranslation();
  const { issueNumber } = useParams();
  const { selectedRepo, setError } = useApp();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedRepo && issueNumber) {
      loadIssue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRepo, issueNumber]);

  const loadIssue = async () => {
    setLoading(true);
    setError(null);
    try {
      const [owner, repo] = selectedRepo.full_name.split('/');
      const issueData = await githubApi.getIssue(owner, repo, issueNumber);
      setIssue(issueData);
    } catch (err) {
      setError(t('issueDetail.errorLoad', { error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRepo) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        {t('issueDetail.selectRepo')}
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

  if (!issue) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {t('issueDetail.notFound')}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')}>
          {t('issueDetail.backToIssues')}
        </Button>
        <Button
          startIcon={<Edit />}
          variant="outlined"
          onClick={() => navigate(`/issue/${issueNumber}/edit`)}
        >
          {t('issueDetail.editIssue')}
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          {issue.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          #{issue.number} {t('issueDetail.opened', { user: issue.user.login })}
        </Typography>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={t(`issueDetail.${issue.state}`)}
          color={issue.state === 'open' ? 'success' : 'default'}
          size="small"
        />
        {issue.labels.map((label) => (
          <Chip
            key={label.id}
            label={label.name}
            size="small"
            sx={{
              backgroundColor: `#${label.color}`,
              color: '#fff',
            }}
          />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          {t('issueDetail.description')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            backgroundColor: 'grey.50',
            p: 2,
            borderRadius: 1,
          }}
        >
          {issue.body || t('issueDetail.noDescription')}
        </Typography>
      </Box>

      {issue.assignees && issue.assignees.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('issueDetail.assignees')}
          </Typography>
          {issue.assignees.map((assignee) => (
            <Chip
              key={assignee.id}
              label={assignee.login}
              avatar={<img src={assignee.avatar_url} alt={assignee.login} />}
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary">
          {t('issueDetail.created', { date: new Date(issue.created_at).toLocaleString() })}
          {issue.updated_at !== issue.created_at && (
            <> • {t('issueDetail.updated', { date: new Date(issue.updated_at).toLocaleString() })}</>
          )}
        </Typography>
      </Box>
    </Paper>
  );
};

export default IssueDetail;
