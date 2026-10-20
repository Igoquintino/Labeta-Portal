/* ============================================================
 * [HOOK] useTheme
 * Descrição: Atalho para consumir o ThemeContext (theme, isDark, toggleTheme, setTheme).
 * ============================================================ */
import { useContext } from 'react';
import { ThemeContext } from './themeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider');
  }
  return context;
}

export default useTheme;
