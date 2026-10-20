/* ============================================================
 * [COMPONENTE] CardAdminActions
 * Descrição: Barra de ações administrativas por card (editar/excluir),
 *            visível nos cards durante o modo de gestão ativa.
 * Rota/Uso: Utilizado por Works, People, News, Lab e Booking.
 * CSS correlato: CardAdminActions.css
 * ============================================================ */
import { ShieldCheck, Edit2, Trash2 } from 'lucide-react';
import './CardAdminActions.css';

/**
 * [FUNÇÃO] CardAdminActions — renderiza a barra in-flow de gestão por card.
 * @param {Object} props
 * @param {string} [props.label='Gestão'] - Rótulo do selo administrativo.
 * @param {Function} props.onEdit - Callback de clique no botão Editar.
 * @param {Function} props.onDelete - Callback de clique no botão Excluir.
 * @param {string} [props.editTitle='Editar registro'] - Acessibilidade do botão Editar.
 * @param {string} [props.deleteTitle='Excluir registro'] - Acessibilidade do botão Excluir.
 * @param {string} [props.className=''] - Classes adicionais.
 */
export function CardAdminActions({
  label = 'Gestão',
  onEdit,
  onDelete,
  editTitle = 'Editar registro',
  deleteTitle = 'Excluir registro',
  className = ''
}) {
  return (
    <div className={`card-admin-actions ${className}`}>
      <span className="card-admin-badge">
        <ShieldCheck size={12} aria-hidden="true" />
        <span>{label}</span>
      </span>

      <div className="card-admin-btns-group">
        <button
          type="button"
          className="admin-action-btn edit"
          title={editTitle}
          aria-label={editTitle}
          onClick={onEdit}
        >
          <Edit2 size={13} aria-hidden="true" />
          <span>Editar</span>
        </button>

        <button
          type="button"
          className="admin-action-btn delete"
          title={deleteTitle}
          aria-label={deleteTitle}
          onClick={onDelete}
        >
          <Trash2 size={13} aria-hidden="true" />
          <span>Excluir</span>
        </button>
      </div>
    </div>
  );
}
