import React from 'react';
import {
  Container,
  Grid,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import { GitHub, Add, CloudUpload, Logout, AccountCircle, Language } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import RepositorySelector from './RepositorySelector';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, handleLogout } = useApp();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [langAnchorEl, setLangAnchorEl] = React.useState(null);

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

          <Tooltip title="Language">
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

          <Tooltip title={user?.login || 'User'}>
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

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <RepositorySelector />
          </Grid>
          <Grid item xs={12} md={9}>
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
