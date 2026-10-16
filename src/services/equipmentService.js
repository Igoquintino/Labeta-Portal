/* ============================================================
 * [SERVIÇO] equipmentService
 * Descrição: Camada de integração para equipamentos do catálogo com persistência
 *            no Supabase e fallback automático para equipment.json.
 * Rota/Uso: Consumido por Booking.jsx e SpotlightSearch.jsx.
 * Dados: Supabase tabela 'equipment' + fallback src/data/equipment.json.
 * CSS correlato: —
 * ============================================================ */
import { supabase, isSupabaseConfigured } from './supabase';
import localEquipmentData from '../data/equipment.json';

/**
 * [FUNÇÃO] mapEquipmentFromDb — Converte registro do Supabase para formato do app.
 * @param {Object} row - Linha retornada do Supabase.
 * @returns {Object} Equipamento formatado.
 */
function mapEquipmentFromDb(row) {
    return {
        id: row.id,
        code: row.code,
        name: row.name,
        category: row.category,
        status: row.status,
        capacity: row.capacity || '',
        description: row.description || '',
        requirements: Array.isArray(row.requirements) ? row.requirements : []
    };
}

/**
 * [FUNÇÃO] mapEquipmentToDb — Converte dados do formulário para colunas do Supabase.
 * @param {Object} data - Dados do equipamento.
 * @returns {Object} Payload para o banco.
 */
function mapEquipmentToDb(data) {
    let reqArray = [];
    if (Array.isArray(data.requirements)) {
        reqArray = data.requirements;
    } else if (typeof data.requirements === 'string') {
        reqArray = data.requirements.split('\n').map((r) => r.trim()).filter(Boolean);
    }

    return {
        code: data.code?.trim() || `LABETA-EQ-${Date.now().toString().slice(-4)}`,
        name: data.name?.trim() || '',
        category: data.category?.trim() || 'Geral',
        status: data.status || 'disponivel',
        capacity: data.capacity?.trim() || null,
        description: data.description?.trim() || null,
        requirements: reqArray
    };
}

/**
 * [FUNÇÃO] fetchEquipment — Busca equipamentos no Supabase com fallback seguro.
 * @returns {Promise<{ equipment: Array, fromRemote: boolean }>}
 */
export async function fetchEquipment() {
    if (!isSupabaseConfigured) {
        return { equipment: localEquipmentData, fromRemote: false };
    }

    try {
        const { data, error } = await supabase
            .from('equipment')
            .select('*')
            .order('name', { ascending: true });

        if (error || !data || data.length === 0) {
            return { equipment: localEquipmentData, fromRemote: false };
        }

        return {
            equipment: data.map(mapEquipmentFromDb),
            fromRemote: true
        };
    } catch {
        return { equipment: localEquipmentData, fromRemote: false };
    }
}

/**
 * [FUNÇÃO] createEquipment — Cadastra um novo equipamento.
 * @param {Object} payload - Dados do equipamento.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function createEquipment(payload) {
    if (!isSupabaseConfigured) {
        return { data: { id: `local-${Date.now()}`, ...payload }, error: null };
    }

    const row = mapEquipmentToDb(payload);
    const { data, error } = await supabase
        .from('equipment')
        .insert([row])
        .select()
        .single();

    if (error) return { data: null, error };
    return { data: mapEquipmentFromDb(data), error: null };
}

/**
 * [FUNÇÃO] updateEquipment — Atualiza equipamento por ID.
 * @param {string|number} id - Identificador único.
 * @param {Object} payload - Dados atualizados.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function updateEquipment(id, payload) {
    if (!isSupabaseConfigured) {
        return { data: { id, ...payload }, error: null };
    }

    const row = mapEquipmentToDb(payload);
    const { data, error } = await supabase
        .from('equipment')
        .update(row)
        .eq('id', id)
        .select()
        .single();

    if (error) return { data: null, error };
    return { data: mapEquipmentFromDb(data), error: null };
}

/**
 * [FUNÇÃO] deleteEquipment — Remove equipamento por ID.
 * @param {string|number} id - Identificador único.
 * @returns {Promise<{ error: Error|null }>}
 */
export async function deleteEquipment(id) {
    if (!isSupabaseConfigured) return { error: null };

    const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

    return { error };
}
