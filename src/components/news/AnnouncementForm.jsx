/**
 * [COMPONENTE] AnnouncementForm
 * Formulário isolado para cadastro e edição de comunicados institucionais.
 */
export function AnnouncementForm({ initialData = {}, onSubmit, onCancel, isSubmitting }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="admin-form-group">
        <label className="admin-form-label">Título</label>
        <input
          name="title"
          type="text"
          required
          className="admin-form-input"
          defaultValue={initialData?.title || ''}
          placeholder="Informe o título principal..."
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Categoria / Tag</label>
        <input
          name="tag"
          type="text"
          required
          className="admin-form-input"
          defaultValue={initialData?.tag || 'Aviso Operacional'}
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Conteúdo do Comunicado</label>
        <textarea
          name="content"
          rows="4"
          required
          className="admin-form-textarea"
          defaultValue={initialData?.content || ''}
          placeholder="Detalhes completos do comunicado..."
        />
      </div>

      <div className="admin-form-actions">
        <button
          type="button"
          className="admin-btn-cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="admin-btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </div>
    </form>
  );
}
