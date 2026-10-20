/* ============================================================
 * [COMPONENTE] DeleteConfirmDialog
 * Descrição: Conteúdo de diálogo padronizado para confirmação de exclusão
 *            dentro do AdminModal.
 * Rota/Uso: Utilizado por Works, People, News, Lab e Booking.
 * CSS correlato: DeleteConfirmDialog.css
 * ============================================================ */
import { AlertTriangle, Loader2 } from 'lucide-react';
import './DeleteConfirmDialog.css';

/**
 * [FUNÇÃO] DeleteConfirmDialog — renderiza o alerta de confirmação de exclusão com ações.
 * @param {Object} props
 * @param {string} props.title - Título ou identificador do item a ser excluído.
 * @param {string} [props.message] - Mensagem personalizada de alerta opcional.
 * @param {Function} props.onConfirm - Callback para confirmar a exclusão.
 * @param {Function} props.onCancel - Callback para cancelar a exclusão.
 * @param {boolean} [props.isSubmitting=false] - Indica se a operação assíncrona está em andamento.
 * @param {string} [props.confirmLabel='Excluir'] - Texto do botão de confirmação.
 * @param {string} [props.cancelLabel='Cancelar'] - Texto do botão de cancelamento.
 */
export function DeleteConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  isSubmitting = false,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar'
}) {
  return (
    <div className="ui-delete-confirm-box">
      <div className="ui-delete-confirm-icon-wrapper" aria-hidden="true">
        <AlertTriangle size={32} className="ui-delete-confirm-icon" />
      </div>

      <p className="ui-delete-confirm-notice">
        {message ? (
          message
        ) : (
          <>
            Tem certeza de que deseja remover <strong className="ui-delete-confirm-highlight">"{title}"</strong>? Esta ação não poderá ser desfeita.
          </>
        )}
      </p>

      <div className="ui-delete-confirm-actions">
        <button
          type="button"
          className="ui-delete-btn-cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          className="ui-delete-btn-danger"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              <span>Removendo...</span>
            </>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </div>
  );
}
