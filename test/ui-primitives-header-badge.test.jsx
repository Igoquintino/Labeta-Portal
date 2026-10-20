import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag } from 'lucide-react';
import { Badge } from '../src/components/common/Badge';
import { PageHeader } from '../src/components/common/PageHeader';

describe('Badge Component', () => {
  it('renders badge with text and custom variant class', () => {
    render(<Badge variant="green">Disponível</Badge>);
    const badge = screen.getByText('Disponível');
    expect(badge).toBeDefined();
    expect(badge.closest('.ui-badge').classList.contains('ui-badge--green')).toBe(true);
  });

  it('renders badge with icon', () => {
    render(<Badge icon={Tag} variant="gold">Pesquisa</Badge>);
    expect(screen.getByText('Pesquisa')).toBeDefined();
    const icon = document.querySelector('svg');
    expect(icon).not.toBeNull();
  });

  it('defaults to gold variant and sm size', () => {
    render(<Badge>Padrão</Badge>);
    const badge = screen.getByText('Padrão').closest('.ui-badge');
    expect(badge.classList.contains('ui-badge--gold')).toBe(true);
    expect(badge.classList.contains('ui-badge--sm')).toBe(true);
  });
});

describe('PageHeader Component', () => {
  it('renders semantic header with title and subtitle', () => {
    render(
      <PageHeader
        title="Trabalhos & Artigos"
        subtitle="Produção científica do LABETA"
      />
    );
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Trabalhos & Artigos');
    expect(screen.getByText('Produção científica do LABETA')).toBeDefined();
  });

  it('renders badge when badgeText is provided', () => {
    render(
      <PageHeader
        badgeIcon={Tag}
        badgeText="Produção"
        title="Trabalhos"
      />
    );
    expect(screen.getByText('Produção')).toBeDefined();
  });

  it('renders child controls (e.g. search slot or extra actions)', () => {
    render(
      <PageHeader title="Título Principal">
        <div data-testid="custom-slot">Controle Customizado</div>
      </PageHeader>
    );
    expect(screen.getByTestId('custom-slot')).toBeDefined();
  });
});
