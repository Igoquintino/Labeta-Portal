/* ============================================================
 * [HOOK] useModalState
 * Descrição: Gerencia estado de modais de gestão (criação, edição, exclusão)
 *            e feedback via toast unificado.
 * Rota/Uso: Utilizado por todas as páginas com operações CRUD.
 * ============================================================ */
import { useState, useCallback } from 'react';

/**
 * [HOOK] useModalState — encapsula estado de diálogo e envio assíncrono.
 * @param {Object} [initialConfig] - Configuração inicial opcional.
 * @returns {Object} Estados e despachantes para controle do modal.
 */
export function useModalState(initialConfig = {}) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    type: '',
    data: null,
    ...initialConfig
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  /** Abre modal em modo criação */
  const openCreate = useCallback((title, type = 'create', defaultData = null) => {
    setModalConfig({
      isOpen: true,
      title,
      type,
      data: defaultData
    });
  }, []);

  /** Abre modal em modo edição */
  const openEdit = useCallback((title, type = 'edit', data = null) => {
    setModalConfig({
      isOpen: true,
      title,
      type,
      data
    });
  }, []);

  /** Abre modal em modo confirmação de exclusão */
  const openDelete = useCallback((title, data = null) => {
    setModalConfig({
      isOpen: true,
      title,
      type: 'delete',
      data
    });
  }, []);

  /** Fecha modal caso não haja submissão em andamento */
  const closeModal = useCallback(() => {
    if (isSubmitting) return;
    setModalConfig((prev) => ({
      ...prev,
      isOpen: false,
      data: null
    }));
  }, [isSubmitting]);

  /** Dispara uma notificação toast */
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  /** Limpa o toast atual */
  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    modalConfig,
    setModalConfig,
    isSubmitting,
    setIsSubmitting,
    toast,
    setToast,
    showToast,
    clearToast,
    openCreate,
    openEdit,
    openDelete,
    closeModal
  };
}
