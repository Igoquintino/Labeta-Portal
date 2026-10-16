/* ============================================================
 * [SERVIÇO] newsService
 * Descrição: Camada de integração para notícias e radar científico com persistência
 *            no Supabase e fallback automático para news.json.
 * Rota/Uso: Consumido por News.jsx e RecentNewsSection.jsx.
 * Dados: Supabase tabela 'news' + fallback src/data/news.json.
 * CSS correlato: —
 * ============================================================ */
import { supabase, isSupabaseConfigured } from './supabase';
import localNewsData from '../data/news.json';

/**
 * [FUNÇÃO] mapNewsFromDb — Converte um registro retornado do Supabase no formato interno do app.
 * @param {Object} row - Linha da tabela news do Supabase.
 * @returns {Object} Objeto no formato compatível com o frontend.
 */
function mapNewsFromDb(row) {
    if (row.type === 'radar') {
        return {
            id: row.id,
            title: row.title,
            journal: row.journal || '',
            year: row.year ? String(row.year) : '',
            authors: row.authors || '',
            summary: row.content || '',
            url: row.url || '',
            doi: row.doi || '',
            date: row.date || ''
        };
    }
    return {
        id: row.id,
        title: row.title,
        date: row.date || '',
        tag: row.tag || 'Comunicado',
        content: row.content || ''
    };
}

/**
 * [FUNÇÃO] mapNewsToDb — Converte dados do formulário/app para as colunas da tabela news do Supabase.
 * @param {string} type - 'announcement' | 'radar'.
 * @param {Object} data - Dados do formulário submetido.
 * @returns {Object} Payload formatado para inserção/atualização no Supabase.
 */
function mapNewsToDb(type, data) {
    if (type === 'radar') {
        return {
            type: 'radar',
            title: data.title?.trim() || '',
            journal: data.journal?.trim() || null,
            year: data.year ? parseInt(data.year, 10) : new Date().getFullYear(),
            authors: data.authors?.trim() || null,
            content: (data.summary || data.content || '').trim(),
            url: data.url?.trim() || null,
            doi: data.doi?.trim() || null,
            date: data.date || new Date().toISOString().split('T')[0]
        };
    }
    return {
        type: 'announcement',
        title: data.title?.trim() || '',
        tag: data.tag?.trim() || 'Aviso Operacional',
        content: (data.content || '').trim(),
        date: data.date || new Date().toISOString().split('T')[0]
    };
}

/**
 * [FUNÇÃO] fetchNews — Busca notícias no Supabase com fallback seguro para news.json.
 * Retorna os itens divididos em announcements e scientificRadar.
 * @returns {Promise<{ announcements: Array, scientificRadar: Array, fromRemote: boolean }>}
 */
export async function fetchNews() {
    if (!isSupabaseConfigured) {
        return {
            announcements: localNewsData.announcements,
            scientificRadar: localNewsData.scientificRadar,
            fromRemote: false
        };
    }

    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('date', { ascending: false });

        if (error || !data || data.length === 0) {
            // Fallback silencioso para arquivo local quando tabela vazia ou erro
            return {
                announcements: localNewsData.announcements,
                scientificRadar: localNewsData.scientificRadar,
                fromRemote: false
            };
        }

        const announcements = [];
        const scientificRadar = [];

        data.forEach((row) => {
            const mapped = mapNewsFromDb(row);
            if (row.type === 'radar') {
                scientificRadar.push(mapped);
            } else {
                announcements.push(mapped);
            }
        });

        return {
            announcements,
            scientificRadar,
            fromRemote: true
        };
    } catch {
        return {
            announcements: localNewsData.announcements,
            scientificRadar: localNewsData.scientificRadar,
            fromRemote: false
        };
    }
}

/**
 * [FUNÇÃO] createNewsItem — Insere um novo comunicado ou artigo no Supabase.
 * @param {string} type - 'announcement' | 'radar'.
 * @param {Object} payload - Dados do item a ser criado.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function createNewsItem(type, payload) {
    if (!isSupabaseConfigured) {
        return {
            data: { id: `local-${Date.now()}`, ...payload },
            error: null
        };
    }

    const row = mapNewsToDb(type, payload);
    const { data, error } = await supabase
        .from('news')
        .insert([row])
        .select()
        .single();

    if (error) {
        return { data: null, error };
    }

    return { data: mapNewsFromDb(data), error: null };
}

/**
 * [FUNÇÃO] updateNewsItem — Atualiza um comunicado ou artigo existente pelo ID.
 * @param {string|number} id - Identificador único do item.
 * @param {string} type - 'announcement' | 'radar'.
 * @param {Object} payload - Dados atualizados.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function updateNewsItem(id, type, payload) {
    if (!isSupabaseConfigured) {
        return {
            data: { id, ...payload },
            error: null
        };
    }

    const row = mapNewsToDb(type, payload);
    const { data, error } = await supabase
        .from('news')
        .update(row)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return { data: null, error };
    }

    return { data: mapNewsFromDb(data), error: null };
}

/**
 * [FUNÇÃO] deleteNewsItem — Remove um item pelo ID.
 * @param {string|number} id - Identificador único do item a remover.
 * @returns {Promise<{ error: Error|null }>}
 */
export async function deleteNewsItem(id) {
    if (!isSupabaseConfigured) {
        return { error: null };
    }

    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

    return { error };
}
