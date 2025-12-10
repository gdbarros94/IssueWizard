import React from 'react';
import {
  Container,
  Grid,
  Box,
  Alert,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  GitHub, 
  Add, 
  CloudUpload, 
  Logout, 
  AccountCircle, 
  Language,
  Brightness4,
  Brightness7,
  Palette,
  Close,
  Check,
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import RepositorySelector from './RepositorySelector';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, handleLogout, error, setError } = useApp();
  const { mode, variant, toggleMode, setThemeVariant, getAvailableThemes } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [langAnchorEl, setLangAnchorEl] = React.useState(null);
  const [themeAnchorEl, setThemeAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    handleLogout();
    navigate('/');
  };

  const handleLangMenu = (event) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    handleLangClose();
  };

  const handleThemeMenu = (event) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleThemeClose = () => {
    setThemeAnchorEl(null);
  };

  const handleThemeVariantChange = (newVariant) => {
    setThemeVariant(newVariant);
    handleThemeClose();
  };

  const languages = [
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'pt-BR', name: 'Português (BR)' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'fr', name: 'Français' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ja', name: '日本語' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <GitHub sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>

          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => navigate('/issue/new')}
          >
            {t('dashboard.newIssue')}
          </Button>

          <Button
            color="inherit"
            startIcon={<CloudUpload />}
            onClick={() => navigate('/bulk-upload')}
          >
            {t('dashboard.bulkUpload')}
          </Button>

          <Tooltip title={t('dashboard.language')}>
            <IconButton
              size="large"
              onClick={handleLangMenu}
              color="inherit"
            >
              <Language />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLangClose}
          >
            {languages.map((lang) => (
              <MenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                selected={i18n.language === lang.code}
              >
                {lang.name}
              </MenuItem>
            ))}
          </Menu>

          <Tooltip title={t('dashboard.themeMode')}>
            <IconButton
              size="large"
              onClick={toggleMode}
              color="inherit"
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title={t('dashboard.themeVariant')}>
            <IconButton
              size="large"
              onClick={handleThemeMenu}
              color="inherit"
            >
              <Palette />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={themeAnchorEl}
            open={Boolean(themeAnchorEl)}
            onClose={handleThemeClose}
          >
            {getAvailableThemes().map((theme) => (
              <MenuItem
                key={theme.key}
                onClick={() => handleThemeVariantChange(theme.key)}
              >
                <ListItemIcon>
                  {variant === theme.key && <Check />}
                </ListItemIcon>
                <ListItemText>{theme.name}</ListItemText>
              </MenuItem>
            ))}
          </Menu>

          <Tooltip title={user?.login || t('dashboard.user')}>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.login}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>
              <Logout sx={{ mr: 1 }} fontSize="small" />
              {t('dashboard.logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {error && (
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setError(null)}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        </Container>
      )}

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <RepositorySelector />
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
