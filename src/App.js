import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { AppProvider, useApp } from './contexts/AppContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import IssueList from './components/IssueList';
import IssueDetail from './components/IssueDetail';
import IssueEditor from './components/IssueEditor';
import BulkUpload from './components/BulkUpload';
import ThemeDemo from './components/ThemeDemo';

const ProtectedRoute = ({ children }) => {
  const { token } = useApp();
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { token } = useApp();
  const { theme } = useTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/theme-demo" element={<ThemeDemo />} />
        <Route 
          path="/login" 
          element={token ? <Navigate to="/" /> : <Login />} 
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<IssueList />} />
          <Route path="issue/new" element={<IssueEditor />} />
          <Route path="issue/:issueNumber" element={<IssueDetail />} />
          <Route path="issue/:issueNumber/edit" element={<IssueEditor />} />
          <Route path="bulk-upload" element={<BulkUpload />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
