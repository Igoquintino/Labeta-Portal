import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModalState } from '../src/hooks/useModalState';
import { useFocusTrap } from '../src/hooks/useFocusTrap';

describe('useModalState', () => {
  it('initializes with default closed state', () => {
    const { result } = renderHook(() => useModalState());
    expect(result.current.modalConfig.isOpen).toBe(false);
    expect(result.current.modalConfig.type).toBe('');
    expect(result.current.modalConfig.data).toBe(null);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.toast).toBe(null);
  });

  it('opens modal in create mode with openCreate', () => {
    const { result } = renderHook(() => useModalState());
    act(() => {
      result.current.openCreate('Novo Registro', 'create');
    });
    expect(result.current.modalConfig.isOpen).toBe(true);
    expect(result.current.modalConfig.title).toBe('Novo Registro');
    expect(result.current.modalConfig.type).toBe('create');
    expect(result.current.modalConfig.data).toBe(null);
  });

  it('opens modal in edit mode with openEdit and sets data', () => {
    const { result } = renderHook(() => useModalState());
    const mockItem = { id: 1, title: 'Item Teste' };
    act(() => {
      result.current.openEdit('Editar Item', 'edit', mockItem);
    });
    expect(result.current.modalConfig.isOpen).toBe(true);
    expect(result.current.modalConfig.title).toBe('Editar Item');
    expect(result.current.modalConfig.type).toBe('edit');
    expect(result.current.modalConfig.data).toEqual(mockItem);
  });

  it('opens modal in delete mode with openDelete', () => {
    const { result } = renderHook(() => useModalState());
    const mockItem = { id: 2, title: 'Item Excluir' };
    act(() => {
      result.current.openDelete('Confirmar Exclusão', mockItem);
    });
    expect(result.current.modalConfig.isOpen).toBe(true);
    expect(result.current.modalConfig.title).toBe('Confirmar Exclusão');
    expect(result.current.modalConfig.type).toBe('delete');
    expect(result.current.modalConfig.data).toEqual(mockItem);
  });

  it('closes modal and prevents closing when isSubmitting is true', () => {
    const { result } = renderHook(() => useModalState());
    act(() => {
      result.current.openCreate('Título', 'create');
      result.current.setIsSubmitting(true);
    });
    // Attempt close while submitting
    act(() => {
      result.current.closeModal();
    });
    expect(result.current.modalConfig.isOpen).toBe(true);

    // After submitting finishes, closeModal works
    act(() => {
      result.current.setIsSubmitting(false);
    });
    act(() => {
      result.current.closeModal();
    });
    expect(result.current.modalConfig.isOpen).toBe(false);
    expect(result.current.modalConfig.data).toBe(null);
  });

  it('handles toast notifications', () => {
    const { result } = renderHook(() => useModalState());
    act(() => {
      result.current.showToast('Operação realizada com sucesso!', 'success');
    });
    expect(result.current.toast).toEqual({
      type: 'success',
      message: 'Operação realizada com sucesso!'
    });
    act(() => {
      result.current.clearToast();
    });
    expect(result.current.toast).toBe(null);
  });
});

describe('useFocusTrap', () => {
  it('returns a containerRef and handles body overflow lock', () => {
    const onClose = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ isOpen }) => useFocusTrap(isOpen, onClose),
      { initialProps: { isOpen: false } }
    );

    expect(document.body.style.overflow).not.toBe('hidden');

    rerender({ isOpen: true });
    expect(document.body.style.overflow).toBe('hidden');

    rerender({ isOpen: false });
    expect(document.body.style.overflow).toBe('unset');

    rerender({ isOpen: true });
    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('triggers onClose when Escape is pressed while open', () => {
    const onClose = vi.fn();
    renderHook(() => useFocusTrap(true, onClose));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
