/* ============================================================
 * [COMPONENTE] FilterTabs
 * Descrição: Barra de navegação por abas / controle segmentado acessível
 *            com suporte a ícone, contagem numérica e indicação de foco.
 * Rota/Uso: Utilizado por Works, People, Booking e SpotlightSearch.
 * CSS correlato: FilterTabs.css
 * ============================================================ */
import './FilterTabs.css';

/**
 * [FUNÇÃO] FilterTabs — renderiza o grupo de abas segmentadas com WAI-ARIA.
 * @param {Object} props
 * @param {Array<{id: string, label: string, icon?: React.ComponentType, count?: number}>} props.tabs - Lista de abas.
 * @param {string} props.activeTab - Identificador da aba ativa.
 * @param {Function} props.onChange - Callback acionado com o id da aba selecionada.
 * @param {string} [props.ariaLabel='Filtros'] - Rótulo acessível da barra.
 * @param {string} [props.className=''] - Classes adicionais.
 */
export function FilterTabs({
  tabs,
  activeTab,
  onChange,
  ariaLabel = 'Filtros',
  className = ''
}) {
  return (
    <nav className={`ui-filter-tabs ${className}`} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`ui-filter-tab-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {Icon && <Icon size={15} aria-hidden="true" className="ui-filter-tab-btn__icon" />}
            <span className="ui-filter-tab-btn__label">{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ui-filter-tab-btn__count">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
