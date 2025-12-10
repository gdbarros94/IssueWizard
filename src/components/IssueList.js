import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  BugReport, 
  Edit, 
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import githubApi from '../services/githubApi';

const IssueList = () => {
  const { t } = useTranslation();
  const { selectedRepo, setError } = useApp();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedRepo) {
      loadIssues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRepo]);

  const loadIssues = async () => {
    if (!selectedRepo) return;

    setLoading(true);
    setError(null);
    try {
      const [owner, repo] = selectedRepo.full_name.split('/');
      const issuesData = await githubApi.getRepositoryIssues(owner, repo);
      // Filter out pull requests (GitHub API returns PRs as issues)
      const filteredIssues = issuesData.filter(issue => !issue.pull_request);
      setIssues(filteredIssues);
    } catch (err) {
      setError(t('issueList.errorLoad', { error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (issue, e) => {
    e.stopPropagation();
    if (!window.confirm(t('issueList.confirmClose', { number: issue.number }))) {
      return;
    }

    try {
      const [owner, repo] = selectedRepo.full_name.split('/');
      await githubApi.deleteIssue(owner, repo, issue.number);
      loadIssues();
    } catch (err) {
      setError(t('issueList.errorClose', { error: err.message }));
    }
  };

  const handleEdit = (issue, e) => {
    e.stopPropagation();
    navigate(`/issue/${issue.number}/edit`);
  };

  const handleView = (issue) => {
    navigate(`/issue/${issue.number}`);
  };

  if (!selectedRepo) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        {t('issueList.selectRepo')}
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
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <BugReport sx={{ mr: 1 }} />
        {t('issueList.title')} ({issues.length})
      </Typography>
      {issues.length === 0 ? (
        <Alert severity="info">{t('issueList.noIssues')}</Alert>
      ) : (
        <List sx={{ maxHeight: 600, overflow: 'auto' }}>
          {issues.map((issue) => (
            <ListItem
              key={issue.id}
              secondaryAction={
                <Box>
                  <Tooltip title={t('issueList.edit')}>
                    <IconButton edge="end" onClick={(e) => handleEdit(issue, e)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('issueList.closeIssue')}>
                    <IconButton edge="end" onClick={(e) => handleDelete(issue, e)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
              disablePadding
            >
              <ListItemButton onClick={() => handleView(issue)}>
                <Box sx={{ mr: 2 }}>
                  {issue.state === 'open' ? (
                    <RadioButtonUnchecked color="success" />
                  ) : (
                    <CheckCircle color="disabled" />
                  )}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">
                        #{issue.number} {issue.title}
                      </Typography>
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
                  }
                  secondary={t('issueList.openedBy', { user: issue.user.login, state: issue.state })}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default IssueList;
