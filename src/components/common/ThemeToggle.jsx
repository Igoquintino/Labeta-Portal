/* ============================================================
 * [COMPONENTE] ThemeToggle
 * Descrição: Botão com ícones dinâmicos Sun/Moon para alternância entre Dark e Light mode.
 * CSS correlato: ThemeToggle.css
 * ============================================================ */
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/useTheme';
import './ThemeToggle.css';

export function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`action-btn theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Alternar para modo claro" : "Alternar para modo escuro"}
      title={isDark ? "Modo Claro (Amazônia Diurna)" : "Modo Escuro (Amazônia Noturna)"}
    >
      {isDark ? (
        <Sun size={17} className="theme-toggle-icon" aria-hidden="true" />
      ) : (
        <Moon size={17} className="theme-toggle-icon" aria-hidden="true" />
      )}
    </button>
  );
}

export default ThemeToggle;
