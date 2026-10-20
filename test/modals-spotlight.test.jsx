import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SpotlightSearch } from '../src/components/modals/SpotlightSearch';
import * as membersService from '../src/services/membersService';
import * as worksService from '../src/services/worksService';
import * as newsService from '../src/services/newsService';
import * as equipmentService from '../src/services/equipmentService';

vi.mock('../src/services/membersService');
vi.mock('../src/services/worksService');
vi.mock('../src/services/newsService');
vi.mock('../src/services/equipmentService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('SpotlightSearch Component', () => {
  const mockMembers = [
    { id: 'm-1', name: 'Dr. Leonardo Sousa', role: 'Coordenador', researchArea: 'Taxonomia' }
  ];
  const mockWorks = [
    { id: 'w-1', title: 'Diatomáceas do Rio Tapajós', authors: 'Sousa et al.', year: 2026, category: 'Ecologia' }
  ];
  const mockNews = {
    announcements: [{ id: 'n-1', title: 'Manutenção Preventiva', date: '2026-10-15', content: 'Calibração' }],
    scientificRadar: [{ id: 'r-1', title: 'Artigo Internacional', journal: 'Phytotaxa', year: '2026', summary: 'Resumo' }]
  };
  const mockEquipment = [
    { id: 'eq-1', name: 'Microscópio Nikon Eclipse', code: 'LABETA-MIC-01', capacity: '1 usuário' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    membersService.fetchMembers.mockResolvedValue({ members: mockMembers, isFallback: false });
    worksService.fetchWorks.mockResolvedValue({ works: mockWorks, isFallback: false });
    newsService.fetchNews.mockResolvedValue({ ...mockNews, isFallback: false });
    equipmentService.fetchEquipment.mockResolvedValue({ equipment: mockEquipment, isFallback: false });
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <MemoryRouter>
        <SpotlightSearch isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders and fetches dynamic content from services when opened', async () => {
    render(
      <MemoryRouter>
        <SpotlightSearch isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Diatomáceas do Rio Tapajós')).toBeDefined();
    });

    expect(membersService.fetchMembers).toHaveBeenCalled();
    expect(worksService.fetchWorks).toHaveBeenCalled();
    expect(newsService.fetchNews).toHaveBeenCalled();
    expect(equipmentService.fetchEquipment).toHaveBeenCalled();

    expect(screen.getByText('Microscópio Nikon Eclipse')).toBeDefined();
    expect(screen.getByText('Manutenção Preventiva')).toBeDefined();
  });

  it('filters results when typing into the search input', async () => {
    render(
      <MemoryRouter>
        <SpotlightSearch isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Diatomáceas do Rio Tapajós')).toBeDefined();
    });

    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'Nikon' } });

    expect(screen.getByText('Microscópio Nikon Eclipse')).toBeDefined();
    expect(screen.queryByText('Diatomáceas do Rio Tapajós')).toBeNull();
  });

  it('filters results by category pills', async () => {
    render(
      <MemoryRouter>
        <SpotlightSearch isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Diatomáceas do Rio Tapajós')).toBeDefined();
    });

    const equipPill = screen.getByRole('button', { name: /^Equipamentos$/i });
    fireEvent.click(equipPill);

    expect(screen.getByText('Microscópio Nikon Eclipse')).toBeDefined();
    expect(screen.queryByText('Diatomáceas do Rio Tapajós')).toBeNull();
  });

  it('closes and triggers navigate when clicking on a result item', async () => {
    const onCloseMock = vi.fn();
    render(
      <MemoryRouter>
        <SpotlightSearch isOpen={true} onClose={onCloseMock} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Diatomáceas do Rio Tapajós')).toBeDefined();
    });

    const workItem = screen.getByText('Diatomáceas do Rio Tapajós');
    fireEvent.click(workItem);

    expect(mockNavigate).toHaveBeenCalledWith('/trabalhos');
    expect(onCloseMock).toHaveBeenCalled();
  });
});
