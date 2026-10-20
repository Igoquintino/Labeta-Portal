import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { News } from '../src/pages/News';
import * as newsService from '../src/services/newsService';
import * as authHook from '../src/context/useAuth';

vi.mock('../src/services/newsService');
vi.mock('../src/context/useAuth');

describe('News Page Integration', () => {
  const mockAnnouncements = [
    {
      id: 'ann-1',
      title: 'Manutenção do Microscópio Confocal',
      tag: 'Aviso Operacional',
      content: 'O equipamento passará por calibração preventiva nesta sexta-feira.',
      date: '2026-10-15'
    }
  ];

  const mockRadar = [
    {
      id: 'radar-1',
      title: 'Biodiversidade de Diatomáceas no Rio Tapajós',
      journal: 'Phytotaxa',
      authors: 'Sousa, L. et al.',
      summary: 'Estudo taxonômico pioneiro sobre diatomáceas epilíticas na região do Baixo Amazonas.',
      year: '2026',
      doi: '10.11646/phytotaxa.589.1.2',
      url: 'https://doi.org/10.11646/phytotaxa.589.1.2',
      date: '2026-10-12'
    }
  ];

  beforeEach(() => {
    newsService.fetchNews.mockResolvedValue({
      announcements: mockAnnouncements,
      scientificRadar: mockRadar,
      isFallback: false
    });
    authHook.useAuth.mockReturnValue({ isAdmin: false });
  });

  it('renders page header, announcements and scientific radar columns', async () => {
    render(<News />);
    expect(screen.getByText('Carregando comunicados...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Notícias & Radar Científico');
    });

    expect(screen.getByText('Manutenção do Microscópio Confocal')).toBeDefined();
    expect(screen.getByText('Biodiversidade de Diatomáceas no Rio Tapajós')).toBeDefined();
  });

  it('filters news content via search input', async () => {
    render(<News />);

    await waitFor(() => {
      expect(screen.getByText('Manutenção do Microscópio Confocal')).toBeDefined();
    });

    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'Diatomáceas' } });

    expect(screen.queryByText('Manutenção do Microscópio Confocal')).toBeNull();
    expect(screen.getByText('Biodiversidade de Diatomáceas no Rio Tapajós')).toBeDefined();
  });

  it('displays admin actions when user is admin', async () => {
    authHook.useAuth.mockReturnValue({ isAdmin: true });
    render(<News />);

    await waitFor(() => {
      expect(screen.getByText('Manutenção do Microscópio Confocal')).toBeDefined();
    });

    const newAnnouncementBtn = screen.getByRole('button', { name: /Novo Comunicado/i });
    const newRadarBtn = screen.getByRole('button', { name: /Novo Artigo Radar/i });
    expect(newAnnouncementBtn).toBeDefined();
    expect(newRadarBtn).toBeDefined();

    const editBtns = screen.getAllByRole('button', { name: /Editar/i });
    expect(editBtns.length).toBeGreaterThanOrEqual(2);
  });
});
