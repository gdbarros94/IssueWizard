import React from 'react';
import {
  Container,
  Box,
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
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import {
  GitHub,
  Add,
  CloudUpload,
  Brightness4,
  Brightness7,
  Palette,
  Check,
  BugReport,
  Star,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const ThemeDemo = () => {
  const { mode, variant, toggleMode, setThemeVariant, getAvailableThemes } = useTheme();
  const [themeAnchorEl, setThemeAnchorEl] = React.useState(null);

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <GitHub sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IssueWizard - Theme Demo
          </Typography>

          <Button color="inherit" startIcon={<Add />}>
            New Issue
          </Button>

          <Button color="inherit" startIcon={<CloudUpload />}>
            Bulk Upload
          </Button>

          <Tooltip title="Toggle Dark/Light Mode">
            <IconButton size="large" onClick={toggleMode} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Theme Variant">
            <IconButton size="large" onClick={handleThemeMenu} color="inherit">
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
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Theme System Demo
        </Typography>
        <Typography variant="body1" paragraph>
          Use the theme icons in the header to switch between dark/light modes and different color variants.
          The theme preference is saved in localStorage.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 4 }}>
          <Card sx={{ minWidth: 300 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BugReport color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Bug Report</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                This is a sample issue card showing how the theme affects different components.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="bug" color="error" size="small" />
                <Chip label="priority-high" size="small" />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
              <Button size="small">Edit</Button>
            </CardActions>
          </Card>

          <Card sx={{ minWidth: 300 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Feature Request</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Another sample card demonstrating the theme colors and styling.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="enhancement" color="primary" size="small" />
                <Chip label="feature" size="small" />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
              <Button size="small">Edit</Button>
            </CardActions>
          </Card>
        </Box>

        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Current Theme Settings
          </Typography>
          <Typography variant="body1">
            <strong>Mode:</strong> {mode}
          </Typography>
          <Typography variant="body1">
            <strong>Variant:</strong> {variant}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            Available variants: Default, Blue, Red, Yellow (each available in both light and dark modes)
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ThemeDemo;
