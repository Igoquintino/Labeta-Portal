import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tag } from 'lucide-react';
import { SearchInput } from '../src/components/common/SearchInput';
import { FilterTabs } from '../src/components/common/FilterTabs';

describe('SearchInput Component', () => {
  it('renders input with placeholder and accessibility label', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
        placeholder="Buscar publicações..."
        ariaLabel="Buscar artigos"
      />
    );
    const input = screen.getByRole('searchbox', { name: 'Buscar artigos' });
    expect(input).toBeDefined();
    expect(input.placeholder).toBe('Buscar publicações...');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(
      <SearchInput
        value=""
        onChange={onChange}
        placeholder="Buscar..."
        ariaLabel="Buscar"
      />
    );
    const input = screen.getByRole('searchbox', { name: 'Buscar' });
    fireEvent.change(input, { target: { value: 'diatomáceas' } });
    expect(onChange).toHaveBeenCalledWith('diatomáceas');
  });

  it('displays clear button only when value is present and clears on click', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <SearchInput
        value=""
        onChange={onChange}
        placeholder="Buscar..."
        ariaLabel="Buscar"
      />
    );
    expect(screen.queryByRole('button', { name: 'Limpar pesquisa' })).toBeNull();

    rerender(
      <SearchInput
        value="algas"
        onChange={onChange}
        placeholder="Buscar..."
        ariaLabel="Buscar"
      />
    );
    const clearBtn = screen.getByRole('button', { name: 'Limpar pesquisa' });
    expect(clearBtn).toBeDefined();

    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith('');
  });
});

describe('FilterTabs Component', () => {
  const mockTabs = [
    { id: 'todos', label: 'Todos', count: 12 },
    { id: 'andamento', label: 'Em Andamento', count: 5, icon: Tag },
    { id: 'concluidos', label: 'Concluídos', count: 7 }
  ];

  it('renders all tabs in tablist with correct accessible roles', () => {
    render(
      <FilterTabs
        tabs={mockTabs}
        activeTab="todos"
        onChange={() => {}}
        ariaLabel="Filtro de trabalhos"
      />
    );
    expect(screen.getByRole('tablist', { name: 'Filtro de trabalhos' })).toBeDefined();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(3);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('calls onChange with tab id when clicked', () => {
    const onChange = vi.fn();
    render(
      <FilterTabs
        tabs={mockTabs}
        activeTab="todos"
        onChange={onChange}
        ariaLabel="Filtro"
      />
    );
    const tabAndamento = screen.getByRole('tab', { name: /Em Andamento/i });
    fireEvent.click(tabAndamento);
    expect(onChange).toHaveBeenCalledWith('andamento');
  });

  it('displays count badge when provided', () => {
    render(
      <FilterTabs
        tabs={mockTabs}
        activeTab="todos"
        onChange={() => {}}
        ariaLabel="Filtro"
      />
    );
    expect(screen.getByText('12')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
  });
});
