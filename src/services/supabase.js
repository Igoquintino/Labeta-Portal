import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Diagnóstico rápido para ter certeza da leitura
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        '🔴 Variáveis do Supabase não encontradas! Verifique o arquivo .env na raiz do projeto e reinicie o Vite.'
    );
}

// Inicializa a conexão com o Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
