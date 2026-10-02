import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { NewProject } from './pages/NewProject';
import { Studio } from './pages/Studio';
import { Templates } from './pages/Templates';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

function AppContent() {
  const { currentView } = useStudio();

  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing />;
      case 'dashboard':
        return <Dashboard />;
      case 'new-project':
        return <NewProject />;
      case 'studio':
        return <Studio />;
      case 'templates':
        return <Templates />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppShell>
      {renderActiveView()}
    </AppShell>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StudioProvider>
        <AppContent />
      </StudioProvider>
    </ErrorBoundary>
  );
}
