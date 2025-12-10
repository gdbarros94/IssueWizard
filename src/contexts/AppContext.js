import React, { createContext, useState, useContext, useEffect } from 'react';
import githubApi from '../services/githubApi';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(githubApi.getToken());
  const [user, setUser] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      validateAndLoadUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const validateAndLoadUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await githubApi.getAuthenticatedUser();
      setUser(userData);
      loadRepositories();
    } catch (err) {
      setError('Invalid token or authentication failed');
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (newToken) => {
    githubApi.setToken(newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    githubApi.clearToken();
    setToken('');
    setUser(null);
    setRepositories([]);
    setSelectedRepo(null);
  };

  const loadRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const repos = await githubApi.getUserRepositories();
      setRepositories(repos);
    } catch (err) {
      setError('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  const selectRepository = (repo) => {
    setSelectedRepo(repo);
  };

  const value = {
    token,
    user,
    selectedRepo,
    repositories,
    loading,
    error,
    handleLogin,
    handleLogout,
    loadRepositories,
    selectRepository,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
