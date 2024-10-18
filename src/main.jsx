import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import GeneratedForm from './GeneratedForm.jsx';  // Import the generated form component
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Default route (form builder screen) */}
        <Route path="/" element={<App />} />
        
        {/* Route for the dynamically generated form */}
        <Route path="/generated-form" element={<GeneratedForm />} />
      </Routes>
    </Router>
  </StrictMode>,
);
