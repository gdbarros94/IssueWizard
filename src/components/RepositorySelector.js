import React from 'react';
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
} from '@mui/material';
import { FolderOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';

const RepositorySelector = () => {
  const { t } = useTranslation();
  const { repositories, selectedRepo, selectRepository, loading } = useApp();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (repositories.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        {t('repositorySelector.noRepos')}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <FolderOutlined sx={{ mr: 1 }} />
        {t('repositorySelector.title')}
      </Typography>
      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {repositories.map((repo) => (
          <ListItem key={repo.id} disablePadding>
            <ListItemButton
              selected={selectedRepo?.id === repo.id}
              onClick={() => selectRepository(repo)}
            >
              <ListItemText
                primary={repo.full_name}
                secondary={repo.description || t('repositorySelector.noDescription')}
              />
              {repo.private && (
                <Chip label={t('repositorySelector.private')} size="small" color="secondary" sx={{ ml: 1 }} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RepositorySelector;
