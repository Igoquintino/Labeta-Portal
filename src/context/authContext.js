/* ============================================================
 * [CONTEXTO] authContext
 * Descrição: Objeto de contexto React de autenticação (separado do provider por causa do fast-refresh).
 * Rota/Uso: Usado por AuthContext.jsx e useAuth.js.
 * Dados: —
 * CSS correlato: —
 * ============================================================ */
import { createContext } from 'react';

export const AuthContext = createContext({});
