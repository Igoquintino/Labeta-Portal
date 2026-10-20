import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardAdminActions } from '../src/components/common/CardAdminActions';
import { DeleteConfirmDialog } from '../src/components/common/DeleteConfirmDialog';
import { AdminModal } from '../src/components/admin/AdminModal';

describe('CardAdminActions Component', () => {
  it('renders admin badge and buttons', () => {
    render(
      <CardAdminActions
        label="Gestão LABETA"
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('Gestão LABETA')).toBeDefined();
    expect(screen.getByRole('button', { name: /Editar/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Excluir/i })).toBeDefined();
  });

  it('triggers onEdit and onDelete callbacks', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CardAdminActions
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

describe('DeleteConfirmDialog Component', () => {
  it('renders confirmation text with item title', () => {
    render(
      <DeleteConfirmDialog
        title="Diatomáceas do Rio Tapajós"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText(/"Diatomáceas do Rio Tapajós"/i)).toBeDefined();
    expect(screen.getByText(/Esta ação não poderá ser desfeita/i)).toBeDefined();
  });

  it('handles onConfirm and onCancel callbacks', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <DeleteConfirmDialog
        title="Item 1"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isSubmitting is true', () => {
    render(
      <DeleteConfirmDialog
        title="Item 1"
        onConfirm={() => {}}
        onCancel={() => {}}
        isSubmitting={true}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /Cancelar/i });
    const deleteBtn = screen.getByRole('button', { name: /Removendo|Excluir/i });
    expect(cancelBtn.disabled).toBe(true);
    expect(deleteBtn.disabled).toBe(true);
  });
});

describe('AdminModal with useFocusTrap integration', () => {
  it('renders title and children when open', () => {
    render(
      <AdminModal isOpen={true} onClose={() => {}} title="Modal de Teste">
        <p>Conteúdo interno</p>
      </AdminModal>
    );

    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Modal de Teste');
    expect(screen.getByText('Conteúdo interno')).toBeDefined();
  });

  it('returns null when closed', () => {
    const { container } = render(
      <AdminModal isOpen={false} onClose={() => {}} title="Modal Fechado">
        <p>Invisível</p>
      </AdminModal>
    );

    expect(container.firstChild).toBeNull();
  });
});
