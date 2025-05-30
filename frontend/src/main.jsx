import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import TutorialDetail from './pages/TutorialDetail';
import CreateTutorial from './pages/CreateTutorial';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tutorials/:id" element={<TutorialDetail />} />
        <Route path="/submit" element={<CreateTutorial />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);