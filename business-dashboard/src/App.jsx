import React from 'react';
import PublicDashboard from './PublicDashboard.jsx';
import OwnerPortal from './OwnerPortal.jsx';
import './final.css';
import './progress.css';

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/owner' || path === '/login') return <OwnerPortal />;
  return <PublicDashboard />;
}
