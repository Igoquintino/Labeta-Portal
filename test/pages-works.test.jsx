import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Works } from '../src/pages/Works';
import * as worksService from '../src/services/worksService';
import * as authHook from '../src/context/useAuth';

vi.mock('../src/services/worksService');
vi.mock('../src/context/useAuth');

describe('Works Page Integration', () => {
  const mockWorks = [
    {
      id: 'work-1',
      title: 'Diatomáceas do Rio Tapajós',
      status: 'em_andamento',
      authors: 'Silva, M. & Lima, J.',
      category: 'Taxonomia',
      year: '2026',
      summary: 'Levantamento da diversidade de diatomáceas na orla fluvial.',
      tags: ['Diatomáceas', 'Tapajós'],
      externalUrl: 'https://doi.org/10.1000/182'
    },
    {
      id: 'work-2',
      title: 'Cianobactérias em Lagos de Várzea',
      status: 'concluido',
      authors: 'Santos, R.',
      category: 'Ecologia Aquática',
      year: '2025',
      summary: 'Avaliação de florações e parâmetros físico-químicos.',
      tags: ['Cianobactérias', 'Várzea'],
      externalUrl: null
    }
  ];

  beforeEach(() => {
    worksService.fetchWorks.mockResolvedValue({ works: mockWorks, isFallback: false });
    authHook.useAuth.mockReturnValue({ isAdmin: false });
  });

  it('renders page header and both works', async () => {
    render(<Works />);
    expect(screen.getByText('Carregando produção científica...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Trabalhos do Laboratório');
    });

    expect(screen.getByText('Diatomáceas do Rio Tapajós')).toBeDefined();
    expect(screen.getByText('Cianobactérias em Lagos de Várzea')).toBeDefined();
  });

  it('filters works by status tab', async () => {
    render(<Works />);

    await waitFor(() => {
      expect(screen.getByText('Diatomáceas do Rio Tapajós')).toBeDefined();
    });

    const andamentoTab = screen.getByRole('tab', { name: /Em Andamento/i });
    fireEvent.click(andamentoTab);

    expect(screen.getByText('Diatomáceas do Rio Tapajós')).toBeDefined();
    expect(screen.queryByText('Cianobactérias em Lagos de Várzea')).toBeNull();
  });

  it('filters works by search query', async () => {
    render(<Works />);

    await waitFor(() => {
      expect(screen.getByText('Diatomáceas do Rio Tapajós')).toBeDefined();
    });

    const searchInput = screen.getByRole('searchbox', { name: 'Filtrar trabalhos científicos' });
    fireEvent.change(searchInput, { target: { value: 'várzea' } });

    expect(screen.queryByText('Diatomáceas do Rio Tapajós')).toBeNull();
    expect(screen.getByText('Cianobactérias em Lagos de Várzea')).toBeDefined();
  });

  it('shows admin actions when user is admin', async () => {
    authHook.useAuth.mockReturnValue({ isAdmin: true });
    render(<Works />);

    await waitFor(() => {
      expect(screen.getByText('Diatomáceas do Rio Tapajós')).toBeDefined();
    });

    const editBtns = screen.getAllByRole('button', { name: /Editar trabalho/i });
    expect(editBtns.length).toBe(2);
  });
});
