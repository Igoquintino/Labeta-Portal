import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Lab } from '../src/pages/Lab';
import * as labService from '../src/services/labService';
import * as authHook from '../src/context/useAuth';

vi.mock('../src/services/labService');
vi.mock('../src/context/useAuth');

describe('Lab Page Integration', () => {
  const mockSpaces = [
    {
      id: 'space-1',
      title: 'Sala de Microscopia Avançada',
      tag: 'Ambiente Óptico Controlado',
      description: 'Espaço climatizado dedicado à microscopia de campo claro.',
      image: '/placeholders/bancada.svg',
      equipment: ['Microscópio Óptico Binocular']
    }
  ];

  const mockProtocols = [
    {
      id: 'proto-1',
      step: '01',
      name: 'Triagem e Concentração',
      details: 'Amostras de água são filtradas e concentradas.'
    }
  ];

  beforeEach(() => {
    labService.fetchLabFacilities.mockResolvedValue({
      spaces: mockSpaces,
      protocols: mockProtocols,
      isFallback: false
    });
    authHook.useAuth.mockReturnValue({ isAdmin: false });
  });

  it('renders page header, spaces and protocol steps', async () => {
    render(
      <MemoryRouter>
        <Lab />
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando infraestrutura...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('O Laboratório');
    });

    expect(screen.getByText('Sala de Microscopia Avançada')).toBeDefined();
    expect(screen.getByText('Triagem e Concentração')).toBeDefined();
    expect(screen.getByText(/UFOPA – Unidade Tapajós/i)).toBeDefined();
  });

  it('renders admin actions for spaces and protocols when user is admin', async () => {
    authHook.useAuth.mockReturnValue({ isAdmin: true });
    render(
      <MemoryRouter>
        <Lab />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sala de Microscopia Avançada')).toBeDefined();
    });

    expect(screen.getByRole('button', { name: /Novo Espaço Analítico/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Nova Etapa \/ Protocolo/i })).toBeDefined();

    const editBtns = screen.getAllByRole('button', { name: /Editar/i });
    expect(editBtns.length).toBeGreaterThanOrEqual(2);
  });
});
