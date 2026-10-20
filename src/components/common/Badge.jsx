/* ============================================================
 * [COMPONENTE] Badge
 * Descrição: Selo / pílula / tag padronizada com variantes temáticas
 *            e garantia do piso de acessibilidade (12px / 0.75rem).
 * Rota/Uso: Global em todas as páginas e cards.
 * CSS correlato: Badge.css
 * ============================================================ */
import './Badge.css';

/**
 * [FUNÇÃO] Badge — renderiza tag com ícone e cor semântica.
 * @param {Object} props
 * @param {React.ComponentType} [props.icon] - Ícone Lucide opcional.
 * @param {'gold'|'green'|'blue'|'danger'|'subtle'} [props.variant='gold'] - Estilo cromático.
 * @param {'sm'|'md'} [props.size='sm'] - Tamanho da tag (sm = 0.75rem, md = 0.85rem).
 * @param {React.ReactNode} props.children - Conteúdo textual da tag.
 * @param {string} [props.className=''] - Classes adicionais opcionais.
 */
export function Badge({
  icon: Icon,
  variant = 'gold',
  size = 'sm',
  children,
  className = '',
  ...rest
}) {
  return (
    <span
      className={`ui-badge ui-badge--${variant} ui-badge--${size} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={size === 'md' ? 14 : 12} aria-hidden="true" className="ui-badge__icon" />}
      <span className="ui-badge__label">{children}</span>
    </span>
  );
}
