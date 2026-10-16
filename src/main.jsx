/* ============================================================
 * [ENTRADA] main
 * Descrição: Ponto de entrada da aplicação: monta React com Router e AuthProvider.
 * Rota/Uso: Carregado por index.html.
 * Dados: nenhum
 * CSS correlato: index.css
 * ============================================================ */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
