/* ============================================================
 * [SERVIÇO] labService
 * Descrição: Camada de integração para os espaços físicos analíticos e a rotina
 *            metodológica do LABETA com persistência no Supabase e fallback
 *            automático para labFacilities.json.
 * Rota/Uso: Consumido por Lab.jsx e SpotlightSearch.jsx.
 * Dados: Supabase tabelas 'lab_spaces' e 'lab_protocols' + fallback src/data/labFacilities.json.
 * CSS correlato: —
 * ============================================================ */
import { supabase, isSupabaseConfigured } from './supabase';
import localLabData from '../data/labFacilities.json';

/**
 * [FUNÇÃO] mapSpaceFromDb — Mapeia espaço do Supabase para o formato do app.
 * @param {Object} row - Linha de lab_spaces.
 * @returns {Object} Espaço formatado.
 */
function mapSpaceFromDb(row) {
    return {
        id: row.id,
        title: row.title,
        tag: row.tag || '',
        description: row.description || '',
        equipment: Array.isArray(row.equipment) ? row.equipment : [],
        image: row.image || '/placeholders/bancada.svg'
    };
}

/**
 * [FUNÇÃO] mapProtocolFromDb — Mapeia protocolo do Supabase para o formato do app.
 * @param {Object} row - Linha de lab_protocols.
 * @returns {Object} Protocolo formatado.
 */
function mapProtocolFromDb(row) {
    return {
        id: row.id,
        step: row.step,
        name: row.name,
        details: row.details || ''
    };
}

/**
 * [FUNÇÃO] fetchLabFacilities — Busca espaços e protocolos no Supabase com fallback.
 * @returns {Promise<{ spaces: Array, protocols: Array, fromRemote: boolean }>}
 */
export async function fetchLabFacilities() {
    if (!isSupabaseConfigured) {
        return {
            spaces: localLabData.spaces,
            protocols: localLabData.protocols,
            fromRemote: false
        };
    }

    try {
        const [spacesRes, protoRes] = await Promise.all([
            supabase.from('lab_spaces').select('*').order('created_at', { ascending: true }),
            supabase.from('lab_protocols').select('*').order('step', { ascending: true })
        ]);

        const hasSpaces = !spacesRes.error && spacesRes.data && spacesRes.data.length > 0;
        const hasProto = !protoRes.error && protoRes.data && protoRes.data.length > 0;

        return {
            spaces: hasSpaces ? spacesRes.data.map(mapSpaceFromDb) : localLabData.spaces,
            protocols: hasProto ? protoRes.data.map(mapProtocolFromDb) : localLabData.protocols,
            fromRemote: hasSpaces || hasProto
        };
    } catch {
        return {
            spaces: localLabData.spaces,
            protocols: localLabData.protocols,
            fromRemote: false
        };
    }
}

/**
 * [FUNÇÃO] createLabSpace — Cadastra um novo espaço analítico no Supabase.
 * @param {Object} payload - Dados do espaço.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function createLabSpace(payload) {
    if (!isSupabaseConfigured) {
        return { data: { id: `local-${Date.now()}`, ...payload }, error: null };
    }

    let eqArray = [];
    if (Array.isArray(payload.equipment)) {
        eqArray = payload.equipment;
    } else if (typeof payload.equipment === 'string') {
        eqArray = payload.equipment.split('\n').map((e) => e.trim()).filter(Boolean);
    }

    const row = {
        title: payload.title?.trim() || '',
        tag: payload.tag?.trim() || null,
        description: payload.description?.trim() || null,
        equipment: eqArray,
        image: payload.image?.trim() || '/placeholders/bancada.svg'
    };

    const { data, error } = await supabase
        .from('lab_spaces')
        .insert([row])
        .select()
        .single();

    if (error) return { data: null, error };
    return { data: mapSpaceFromDb(data), error: null };
}

/**
 * [FUNÇÃO] updateLabSpace — Atualiza um espaço pelo ID.
 * @param {string|number} id - Identificador único do espaço.
 * @param {Object} payload - Dados atualizados.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function updateLabSpace(id, payload) {
    if (!isSupabaseConfigured) {
        return { data: { id, ...payload }, error: null };
    }

    let eqArray = [];
    if (Array.isArray(payload.equipment)) {
        eqArray = payload.equipment;
    } else if (typeof payload.equipment === 'string') {
        eqArray = payload.equipment.split('\n').map((e) => e.trim()).filter(Boolean);
    }

    const row = {
        title: payload.title?.trim() || '',
        tag: payload.tag?.trim() || null,
        description: payload.description?.trim() || null,
        equipment: eqArray,
        image: payload.image?.trim() || '/placeholders/bancada.svg'
    };

    const { data, error } = await supabase
        .from('lab_spaces')
        .update(row)
        .eq('id', id)
        .select()
        .single();

    if (error) return { data: null, error };
    return { data: mapSpaceFromDb(data), error: null };
}

/**
 * [FUNÇÃO] deleteLabSpace — Remove um espaço pelo ID.
 * @param {string|number} id - Identificador único.
 * @returns {Promise<{ error: Error|null }>}
 */
export async function deleteLabSpace(id) {
    if (!isSupabaseConfigured) return { error: null };

    const { error } = await supabase
        .from('lab_spaces')
        .delete()
        .eq('id', id);

    return { error };
}

/**
 * [FUNÇÃO] createLabProtocol — Cadastra uma nova etapa na rotina metodológica.
 * @param {Object} payload - Dados da etapa.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function createLabProtocol(payload) {
    if (!isSupabaseConfigured) {
        return { data: { id: `local-${Date.now()}`, ...payload }, error: null };
    }

    const row = {
        step: payload.step?.trim() || '00',
        name: payload.name?.trim() || '',
        details: payload.details?.trim() || null
    };

    const { data, error } = await supabase
        .from('lab_protocols')
        .insert([row])
        .select()
        .single();

    if (error) return { data: null, error };
    return { data: mapProtocolFromDb(data), error: null };
}

/**
 * [FUNÇÃO] updateLabProtocol — Atualiza uma etapa metodológica.
 * @param {string|number} id - Identificador ou step.
 * @param {Object} payload - Dados atualizados.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function updateLabProtocol(id, payload) {
    if (!isSupabaseConfigured) {
        return { data: { id, ...payload }, error: null };
    }

    const row = {
        step: payload.step?.trim() || '00',
        name: payload.name?.trim() || '',
        details: payload.details?.trim() || null
    };

    const { data, error } = await supabase
        .from('lab_protocols')
        .update(row)
        .eq('id', id)
        .select()
        .single();

    if (error) return { data: null, error };
    return { data: mapProtocolFromDb(data), error: null };
}

/**
 * [FUNÇÃO] deleteLabProtocol — Remove uma etapa metodológica.
 * @param {string|number} id - Identificador.
 * @returns {Promise<{ error: Error|null }>}
 */
export async function deleteLabProtocol(id) {
    if (!isSupabaseConfigured) return { error: null };

    const { error } = await supabase
        .from('lab_protocols')
        .delete()
        .eq('id', id);

    return { error };
}
