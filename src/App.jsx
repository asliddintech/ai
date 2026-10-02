import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { AppShell } from './components/layout/AppShell';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { NewProject } from './pages/NewProject';
import { Studio } from './pages/Studio';
import { Templates } from './pages/Templates';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

function AppContent() {
  const { currentView } = useStudio();

  return (
    <AppShell>
      {currentView === 'landing' && <Landing />}
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'new-project' && <NewProject />}
      {currentView === 'studio' && <Studio />}
      {currentView === 'templates' && <Templates />}
      {currentView === 'history' && <History />}
      {currentView === 'settings' && <Settings />}
    </AppShell>
  );
}

export default function App() {
  return (
    <StudioProvider>
      <AppContent />
    </StudioProvider>
  );
}
