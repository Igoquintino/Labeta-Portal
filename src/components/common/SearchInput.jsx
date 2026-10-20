/* ============================================================
 * [COMPONENTE] SearchInput
 * Descrição: Campo de busca padronizado com ícone de lupa,
 *            botão acessível de limpar (X) e suporte a acessibilidade.
 * Rota/Uso: Utilizado por Works, News e SpotlightSearch.
 * CSS correlato: SearchInput.css
 * ============================================================ */
import { Search, X } from 'lucide-react';
import './SearchInput.css';

/**
 * [FUNÇÃO] SearchInput — renderiza input de busca acessível com botão de limpar.
 * @param {Object} props
 * @param {string} props.value - Texto atual do campo de pesquisa.
 * @param {Function} props.onChange - Callback invocado com o novo valor digitado.
 * @param {string} [props.placeholder='Buscar...'] - Texto de placeholder.
 * @param {string} [props.ariaLabel='Buscar'] - Rótulo acessível do input.
 * @param {string} [props.className=''] - Classes adicionais para o wrapper.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  ariaLabel = 'Buscar',
  className = '',
  ...rest
}) {
  return (
    <div className={`ui-search-input-wrapper ${className}`} role="search">
      <Search size={18} className="ui-search-input__icon" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="ui-search-input__control"
        aria-label={ariaLabel}
        {...rest}
      />
      {value && (
        <button
          type="button"
          className="ui-search-input__clear-btn"
          onClick={() => onChange('')}
          aria-label="Limpar pesquisa"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
