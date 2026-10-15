import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
