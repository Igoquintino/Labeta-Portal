/* ============================================================
 * [SERVIÇO] worksService
 * Descrição: Camada de integração para a produção científica do LABETA com persistência
 *            no Supabase e fallback automático para works.json.
 * Rota/Uso: Consumido por Works.jsx e SpotlightSearch.jsx.
 * Dados: Supabase tabela 'works' + fallback src/data/works.json.
 * CSS correlato: —
 * ============================================================ */
import { supabase, isSupabaseConfigured } from './supabase';
import localWorksData from '../data/works.json';

/**
 * [FUNÇÃO] mapWorkFromDb — Converte um registro da tabela works para o formato do app.
 * @param {Object} row - Linha retornada do Supabase.
 * @returns {Object} Trabalho formatado para o frontend.
 */
function mapWorkFromDb(row) {
    return {
        id: row.id,
        title: row.title,
        status: row.status,
        authors: row.authors,
        year: row.year,
        category: row.category,
        summary: row.summary || '',
        tags: Array.isArray(row.tags) ? row.tags : [],
        doi: row.doi || null,
        externalUrl: row.external_url || null
    };
}

/**
 * [FUNÇÃO] mapWorkToDb — Converte dados do formulário para as colunas da tabela works.
 * @param {Object} data - Dados preenchidos no modal.
 * @returns {Object} Payload para o Supabase.
 */
function mapWorkToDb(data) {
    let tagsArray = [];
    if (Array.isArray(data.tags)) {
        tagsArray = data.tags;
    } else if (typeof data.tags === 'string') {
        tagsArray = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    return {
        title: data.title?.trim() || '',
        status: data.status || 'em_andamento',
        authors: data.authors?.trim() || '',
        year: data.year ? String(data.year).trim() : String(new Date().getFullYear()),
        category: data.category?.trim() || 'Pesquisa Científica',
        summary: data.summary?.trim() || null,
        tags: tagsArray,
        doi: data.doi?.trim() || null,
        external_url: data.externalUrl?.trim() || null
    };
}

/**
 * [FUNÇÃO] fetchWorks — Busca os trabalhos no Supabase com fallback seguro para works.json.
 * @returns {Promise<{ works: Array, fromRemote: boolean }>}
 */
export async function fetchWorks() {
    if (!isSupabaseConfigured) {
        return { works: localWorksData, fromRemote: false };
    }

    try {
        const { data, error } = await supabase
            .from('works')
            .select('*')
            .order('year', { ascending: false });

        if (error || !data || data.length === 0) {
            return { works: localWorksData, fromRemote: false };
        }

        return {
            works: data.map(mapWorkFromDb),
            fromRemote: true
        };
    } catch {
        return { works: localWorksData, fromRemote: false };
    }
}

/**
 * [FUNÇÃO] createWork — Cadastra um novo trabalho/projeto no Supabase.
 * @param {Object} payload - Dados do trabalho.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function createWork(payload) {
    if (!isSupabaseConfigured) {
        return { data: { id: `local-${Date.now()}`, ...payload }, error: null };
    }

    const row = mapWorkToDb(payload);
    const { data, error } = await supabase
        .from('works')
        .insert([row])
        .select()
        .single();

    if (error) return { data: null, error };
    return { data: mapWorkFromDb(data), error: null };
}

/**
 * [FUNÇÃO] updateWork — Atualiza um trabalho pelo ID.
 * @param {string|number} id - Identificador do trabalho.
 * @param {Object} payload - Dados atualizados.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function updateWork(id, payload) {
    if (!isSupabaseConfigured) {
        return { data: { id, ...payload }, error: null };
    }

    const row = mapWorkToDb(payload);
    const { data, error } = await supabase
        .from('works')
        .update(row)
        .eq('id', id)
        .select()
        .single();

    if (error) return { data: null, error };
    return { data: mapWorkFromDb(data), error: null };
}

/**
 * [FUNÇÃO] deleteWork — Remove um trabalho pelo ID.
 * @param {string|number} id - Identificador único.
 * @returns {Promise<{ error: Error|null }>}
 */
export async function deleteWork(id) {
    if (!isSupabaseConfigured) return { error: null };

    const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', id);

    return { error };
}
