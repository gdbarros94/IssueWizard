import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import IssueList from './components/IssueList';
import IssueDetail from './components/IssueDetail';
import IssueEditor from './components/IssueEditor';
import BulkUpload from './components/BulkUpload';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { token } = useApp();
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { token } = useApp();

  return (
    <Routes>
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
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
