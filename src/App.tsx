import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import AppComponent from './src/App';
import './src/index.css';

export default function App() {
  return (
    <AuthProvider>
      <AppComponent />
    </AuthProvider>
  );
}