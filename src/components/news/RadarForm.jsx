/**
 * [COMPONENTE] RadarForm
 * Formulário isolado para cadastro e edição de artigos do radar científico.
 */
export function RadarForm({ initialData = {}, onSubmit, onCancel, isSubmitting }) {
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
        <label className="admin-form-label">Periódico / Revista</label>
        <input
          name="journal"
          type="text"
          required
          className="admin-form-input"
          defaultValue={initialData?.journal || ''}
          placeholder="Ex.: Phytotaxa, Hydrobiologia..."
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Autores</label>
        <input
          name="authors"
          type="text"
          required
          className="admin-form-input"
          defaultValue={initialData?.authors || ''}
          placeholder="Sobrenome, N. et al."
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Resumo Técnico</label>
        <textarea
          name="summary"
          rows="3"
          required
          className="admin-form-textarea"
          defaultValue={initialData?.summary || ''}
          placeholder="Resumo do artigo..."
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Link DOI / URL</label>
        <input
          name="url"
          type="url"
          required
          className="admin-form-input"
          defaultValue={initialData?.url || ''}
          placeholder="https://doi.org/..."
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Código DOI (opcional)</label>
        <input
          name="doi"
          type="text"
          className="admin-form-input"
          defaultValue={initialData?.doi || ''}
          placeholder="Ex.: 10.1016/j.algal.2026.103980"
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
