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
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';

const Login = () => {
  const { t } = useTranslation();
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
            {t('login.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {t('login.subtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label={t('login.tokenLabel')}
              variant="outlined"
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              margin="normal"
              required
              helperText={t('login.tokenHelper')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
            >
              {t('login.connectButton')}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('login.noToken')}{' '}
              <Link
                href="https://github.com/settings/tokens/new?scopes=repo"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('login.createToken')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
