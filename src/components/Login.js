import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';

const Login = () => {
  const [tokenInput, setTokenInput] = useState('');
  const { handleLogin, error } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      handleLogin(tokenInput.trim());
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GitHub sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            IssueWizard
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Manage GitHub issues with ease
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="GitHub Personal Access Token"
              variant="outlined"
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              margin="normal"
              required
              helperText="Enter your GitHub personal access token with repo scope"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
            >
              Connect to GitHub
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have a token?{' '}
              <Link
                href="https://github.com/settings/tokens/new?scopes=repo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Create one here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
