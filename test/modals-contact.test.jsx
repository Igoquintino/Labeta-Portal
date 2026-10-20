import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactModal } from '../src/components/modals/ContactModal';
import * as membersService from '../src/services/membersService';

vi.mock('../src/services/membersService');

describe('ContactModal Component', () => {
  const mockMembers = [
    {
      id: 'coord-1',
      name: 'Dr. Leonardo Sousa',
      role: 'Coordenador',
      email: 'leonardo@ufopa.edu.br',
      lattes: 'http://lattes.cnpq.br/1234567890123456',
      avatar: '/membros/membro-coord.jpg'
    },
    {
      id: 'disc-1',
      name: 'Maria Eduarda',
      role: 'Discente',
      email: 'maria@ufopa.edu.br',
      lattes: '',
      avatar: ''
    }
  ];

  beforeEach(() => {
    membersService.fetchMembers.mockResolvedValue({
      members: mockMembers,
      isFallback: false
    });
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<ContactModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders members dynamically from membersService when opened', async () => {
    render(<ContactModal isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Leonardo Sousa')).toBeDefined();
    });

    expect(screen.getByText('leonardo@ufopa.edu.br')).toBeDefined();
    expect(screen.getByText('Maria Eduarda')).toBeDefined();
    expect(screen.getByText('maria@ufopa.edu.br')).toBeDefined();
  });

  it('handles copying email address to clipboard with feedback', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    });

    render(<ContactModal isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Leonardo Sousa')).toBeDefined();
    });

    const copyBtn = screen.getByRole('button', { name: /Copiar e-mail de Dr\. Leonardo Sousa/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('leonardo@ufopa.edu.br');
    expect(await screen.findByText('Copiado!')).toBeDefined();
  });

  it('invokes onClose when clicking the close button', async () => {
    const onCloseMock = vi.fn();
    render(<ContactModal isOpen={true} onClose={onCloseMock} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Fechar janela de contatos/i })).toBeDefined();
    });

    const closeBtn = screen.getByRole('button', { name: /Fechar janela de contatos/i });
    fireEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
