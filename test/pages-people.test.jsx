import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { People } from '../src/pages/People';
import * as membersService from '../src/services/membersService';
import * as authHook from '../src/context/useAuth';

vi.mock('../src/services/membersService');
vi.mock('../src/context/useAuth');

describe('People Page Integration', () => {
  const mockMembers = [
    {
      id: 'coord-1',
      name: 'Dr. Leonardo Sousa',
      category: 'coordenacao',
      role: 'Coordenador do Laboratório',
      researchArea: 'Taxonomia de Algas Continentais',
      bio: 'Doutor em Botânica Tropical.',
      email: 'leonardo@ufopa.edu.br',
      lattes: 'http://lattes.cnpq.br/1234567890123456',
      avatar: '/membros/membro-coord.jpg'
    },
    {
      id: 'disc-1',
      name: 'Maria Eduarda',
      category: 'discentes',
      role: 'Bolsista PIBIC',
      researchArea: 'Fitoplâncton do Tapajós',
      bio: 'Graduanda em Ciências Biológicas.',
      email: 'maria@ufopa.edu.br',
      lattes: '',
      avatar: ''
    }
  ];

  beforeEach(() => {
    membersService.fetchMembers.mockResolvedValue({ members: mockMembers, isFallback: false });
    authHook.useAuth.mockReturnValue({ isAdmin: false });
  });

  it('renders page header and members list', async () => {
    render(<People />);
    expect(screen.getByText('Carregando quadro de pesquisadores...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Equipe & Pesquisadores');
    });

    expect(screen.getByText('Dr. Leonardo Sousa')).toBeDefined();
    expect(screen.getByText('Maria Eduarda')).toBeDefined();
  });

  it('filters members by category tabs', async () => {
    render(<People />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Leonardo Sousa')).toBeDefined();
    });

    const discTab = screen.getByRole('tab', { name: /Discentes/i });
    fireEvent.click(discTab);

    expect(screen.queryByText('Dr. Leonardo Sousa')).toBeNull();
    expect(screen.getByText('Maria Eduarda')).toBeDefined();
  });

  it('displays admin actions when user is admin', async () => {
    authHook.useAuth.mockReturnValue({ isAdmin: true });
    render(<People />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Leonardo Sousa')).toBeDefined();
    });

    const editBtns = screen.getAllByRole('button', { name: /Editar integrante/i });
    expect(editBtns.length).toBe(2);
  });
});
