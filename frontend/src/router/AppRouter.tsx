import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import InboxPage from '../pages/FeedPage';
import Modal from '../pages/Modal';
// Importa otras páginas más adelante...

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/feed" element={<InboxPage />} />
        <Route path="/modal" element={<Modal />} />
        {/* Agrega más rutas aquí */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
