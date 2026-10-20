/* ============================================================
 * [COMPONENTE] PageHeader
 * Descrição: Cabeçalho institucional reutilizável para páginas internas
 *            (selo superior, h1, subtítulo e slot opcional de controles).
 * Rota/Uso: Utilizado por Works, People, News, Lab e Booking.
 * CSS correlato: PageHeader.css
 * ============================================================ */
import { Badge } from './Badge';
import './PageHeader.css';

/**
 * [FUNÇÃO] PageHeader — renderiza o cabeçalho padronizado da página.
 * @param {Object} props
 * @param {React.ComponentType} [props.badgeIcon] - Ícone do selo superior.
 * @param {string} [props.badgeText] - Texto do selo superior.
 * @param {'gold'|'green'|'blue'|'danger'|'subtle'} [props.badgeVariant='gold'] - Estilo do badge.
 * @param {string} props.title - Título principal (h1).
 * @param {string} [props.subtitle] - Descrição/subtítulo explicativo.
 * @param {React.ReactNode} [props.children] - Controles adicionais (ex.: barra de busca, abas).
 * @param {string} [props.className=''] - Classes adicionais.
 */
export function PageHeader({
  badgeIcon,
  badgeText,
  badgeVariant = 'gold',
  title,
  subtitle,
  children,
  className = ''
}) {
  return (
    <header className={`ui-page-header ${className}`}>
      {badgeText && (
        <div className="ui-page-header__badge-wrapper">
          <Badge icon={badgeIcon} variant={badgeVariant} size="md">
            {badgeText}
          </Badge>
        </div>
      )}

      <h1 className="ui-page-header__title">{title}</h1>

      {subtitle && (
        <p className="ui-page-header__subtitle">{subtitle}</p>
      )}

      {children && (
        <div className="ui-page-header__actions">
          {children}
        </div>
      )}
    </header>
  );
}
