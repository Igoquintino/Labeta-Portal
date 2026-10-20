import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Booking } from '../src/pages/Booking';
import * as equipmentService from '../src/services/equipmentService';
import * as authHook from '../src/context/useAuth';

vi.mock('../src/services/equipmentService');
vi.mock('../src/context/useAuth');

describe('Booking Page Integration', () => {
  const mockEquipment = [
    {
      id: 'eq-1',
      name: 'Microscópio Óptico Trinocular Nikon Eclipse',
      code: 'LABETA-MIC-01',
      category: 'Microscopia',
      status: 'disponivel',
      description: 'Microscópio com óptica infinita para campo claro e contraste de fase.',
      capacity: '1 pesquisador por turno',
      requirements: ['Treinamento obrigatório']
    },
    {
      id: 'eq-2',
      name: 'Autoclave Vertical Prismatec',
      code: 'LABETA-AUT-01',
      category: 'Esterilização',
      status: 'manutencao_preventiva',
      description: 'Capacidade 75 litros para esterilização de meios de cultura.',
      capacity: 'Lotes de até 20 frascos',
      requirements: ['EPIs térmicos']
    }
  ];

  beforeEach(() => {
    equipmentService.fetchEquipment.mockResolvedValue({
      equipment: mockEquipment,
      isFallback: false
    });
    authHook.useAuth.mockReturnValue({ isAdmin: false });
  });

  it('renders page header, restriction banner and equipment catalog', async () => {
    render(<Booking />);
    expect(screen.getByText('Carregando catálogo de equipamentos...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Portal de Agendamento do LABETA');
    });

    expect(screen.getByText('Microscópio Óptico Trinocular Nikon Eclipse')).toBeDefined();
    expect(screen.getByText('Autoclave Vertical Prismatec')).toBeDefined();
    expect(screen.getByText(/Aviso de Elegibilidade de Uso/i)).toBeDefined();
  });

  it('switches to agenda and shifts tab when tab clicked', async () => {
    render(<Booking />);

    await waitFor(() => {
      expect(screen.getByText('Microscópio Óptico Trinocular Nikon Eclipse')).toBeDefined();
    });

    const agendaTab = screen.getByRole('tab', { name: /Agenda e Solicitação/i });
    fireEvent.click(agendaTab);

    expect(screen.getByText('Disponibilidade do Laboratório')).toBeDefined();
    expect(screen.getByText('Submissão de Agendamento')).toBeDefined();
    expect(screen.getByText('Preferencial para triagem de fitoplâncton fresco e preparo inicial de lâminas.')).toBeDefined();
  });

  it('displays admin actions when user is admin', async () => {
    authHook.useAuth.mockReturnValue({ isAdmin: true });
    render(<Booking />);

    await waitFor(() => {
      expect(screen.getByText('Microscópio Óptico Trinocular Nikon Eclipse')).toBeDefined();
    });

    expect(screen.getByRole('button', { name: /Novo Equipamento/i })).toBeDefined();
    const editBtns = screen.getAllByRole('button', { name: /Editar equipamento/i });
    expect(editBtns.length).toBe(2);
  });
});
