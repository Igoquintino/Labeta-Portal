/* ============================================================
 * [SERVIÇO] membersService
 * Descrição: Camada de integração para a equipe do LABETA com persistência
 *            no Supabase e fallback automático para members.json.
 * Rota/Uso: Consumido por People.jsx, ContactModal.jsx e SpotlightSearch.jsx.
 * Dados: Supabase tabela 'members' + fallback src/data/members.json.
 * CSS correlato: —
 * ============================================================ */
import { supabase, isSupabaseConfigured } from './supabase';
import localMembersData from '../data/members.json';

/**
 * [FUNÇÃO] mapMemberFromDb — Converte um registro da tabela members do Supabase para o formato do app.
 * @param {Object} row - Linha retornada do Supabase.
 * @returns {Object} Membro formatado para o frontend.
 */
function mapMemberFromDb(row) {
    return {
        id: row.id,
        name: row.name,
        role: row.role,
        category: row.category,
        researchArea: row.research_area || '',
        bio: row.bio || '',
        email: row.email || '',
        lattes: row.lattes || '',
        avatar: row.avatar || ''
    };
}

/**
 * [FUNÇÃO] mapMemberToDb — Converte dados do formulário para as colunas da tabela members.
 * @param {Object} data - Dados preenchidos no modal.
 * @returns {Object} Payload para o Supabase.
 */
function mapMemberToDb(data) {
    return {
        name: data.name?.trim() || '',
        role: data.role?.trim() || '',
        category: data.category || 'discentes',
        research_area: data.researchArea?.trim() || null,
        bio: data.bio?.trim() || null,
        email: data.email?.trim() || null,
        lattes: data.lattes?.trim() || null,
        avatar: data.avatar?.trim() || null
    };
}

/**
 * [FUNÇÃO] fetchMembers — Busca os membros no Supabase com fallback seguro para members.json.
 * @returns {Promise<{ members: Array, fromRemote: boolean }>}
 */
export async function fetchMembers() {
    if (!isSupabaseConfigured) {
        return { members: localMembersData, fromRemote: false };
    }

    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('name', { ascending: true });

        if (error || !data || data.length === 0) {
            return { members: localMembersData, fromRemote: false };
        }

        return {
            members: data.map(mapMemberFromDb),
            fromRemote: true
        };
    } catch {
        return { members: localMembersData, fromRemote: false };
    }
}

/**
 * [FUNÇÃO] createMember — Cadastra um novo membro no Supabase.
 * @param {Object} payload - Dados do membro.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function createMember(payload) {
    if (!isSupabaseConfigured) {
        return { data: { id: `local-${Date.now()}`, ...payload }, error: null };
    }

    const row = mapMemberToDb(payload);
    const { data, error } = await supabase
        .from('members')
        .insert([row])
        .select()
        .single();

    if (error) return { data: null, error };
    return { data: mapMemberFromDb(data), error: null };
}

/**
 * [FUNÇÃO] updateMember — Atualiza os dados de um membro pelo ID.
 * @param {string|number} id - Identificador do membro.
 * @param {Object} payload - Dados atualizados.
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function updateMember(id, payload) {
    if (!isSupabaseConfigured) {
        return { data: { id, ...payload }, error: null };
    }

    const row = mapMemberToDb(payload);
    const { data, error } = await supabase
        .from('members')
        .update(row)
        .eq('id', id)
        .select()
        .single();

    if (error) return { data: null, error };
    return { data: mapMemberFromDb(data), error: null };
}

/**
 * [FUNÇÃO] deleteMember — Remove um membro pelo ID.
 * @param {string|number} id - Identificador único do membro.
 * @returns {Promise<{ error: Error|null }>}
 */
export async function deleteMember(id) {
    if (!isSupabaseConfigured) return { error: null };

    const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

    return { error };
}
