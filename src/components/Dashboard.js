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
import { GitHub, Add, CloudUpload, Logout, AccountCircle } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import RepositorySelector from './RepositorySelector';

const Dashboard = () => {
  const { user, handleLogout } = useApp();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <GitHub sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IssueWizard
          </Typography>

          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => navigate('/issue/new')}
          >
            New Issue
          </Button>

          <Button
            color="inherit"
            startIcon={<CloudUpload />}
            onClick={() => navigate('/bulk-upload')}
          >
            Bulk Upload
          </Button>

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
              Logout
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
