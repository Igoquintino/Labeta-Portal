/* ============================================================
 * [SERVIÇO] supabase
 * Descrição: Cliente Supabase com fallback seguro (placeholder) quando as variáveis de ambiente não existem.
 * Rota/Uso: Importado por AuthContext.
 * Dados: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (.env)
 * CSS correlato: —
 * ============================================================ */
import { createClient } from '@supabase/supabase-js';

// [CONFIG] Credenciais lidas do ambiente Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/** [CONFIG] isSupabaseConfigured — true se URL e chave anônima estão definidas. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    console.warn(
        '⚠️ Variáveis do Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) não encontradas. O portal funcionará em modo somente-leitura estático.'
    );
}

// Inicializa a conexão com o Supabase ou cliente placeholder seguro para evitar crash
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
        auth: { persistSession: false, autoRefreshToken: false }
    });
