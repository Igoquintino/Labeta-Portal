/* ============================================================
 * [HOOK] useAuth
 * Descrição: Atalho para consumir o AuthContext (user, isAdmin, loading, sendMagicLink, signOut).
 * Rota/Uso: Qualquer componente dentro de <AuthProvider>.
 * Dados: AuthContext
 * CSS correlato: —
 * ============================================================ */
import { useContext } from 'react';
import { AuthContext } from './authContext';

export const useAuth = () => useContext(AuthContext);
export default useAuth;
