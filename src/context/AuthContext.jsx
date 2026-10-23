/* ============================================================
- [CONTEXTO] AuthContext (AuthProvider)
- Descrição: Provedor de sessão: usuário, status de administrador (whitelist `admins`), login por link mágico e expiração por inatividade.
- Rota/Uso: Envolve <App /> em main.jsx.
- Dados: Supabase (auth + tabela admins)
- CSS correlato: —
- ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { AuthContext } from './authContext';

// [CONFIGURAÇÃO] Tempo limite de inatividade (15 minutos em milissegundos)
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

/** [FUNÇÃO] AuthProvider — expõe { user, isAdmin, loading, sendMagicLink, signOut } via contexto. */
export function AuthProvider({ children }) {
    // [ESTADO] user — usuário autenticado (ou null)
    const [user, setUser] = useState(null);
    // [ESTADO] isAdmin — e-mail encontrado na whitelist de administradores
    const [isAdmin, setIsAdmin] = useState(false);
    // [ESTADO] loading — verificação inicial de sessão em andamento
    const [loading, setLoading] = useState(isSupabaseConfigured);

    // [REF] timerRef — referência mutável para o temporizador de inatividade
    const timerRef = useRef(null);

    // Consulta se o e-mail está na whitelist do banco
    /** [FUNÇÃO] checkAdminStatus — consulta a tabela `admins` e atualiza isAdmin. */
    const checkAdminStatus = async (userEmail) => {
        if (!userEmail || !isSupabaseConfigured) {
            setIsAdmin(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('admins')
                .select('email')
                .eq('email', userEmail)
                .maybeSingle();

            if (data && !error) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch {
            setIsAdmin(false);
        }
    };

    // Encerrar sessão
    /** [FUNÇÃO] signOut — encerra a sessão, limpa temporizadores e redefine os estados. */
    const signOut = async () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (isSupabaseConfigured) {
            await supabase.auth.signOut();
        }

        setUser(null);
        setIsAdmin(false);
    };

    /** [FUNÇÃO] resetInactivityTimer — redefine a contagem regressiva de inatividade se o admin estiver ativo. */
    const resetInactivityTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (user && isAdmin) {
            timerRef.current = setTimeout(() => {
                signOut();
            }, INACTIVITY_TIMEOUT_MS);
        }
    }, [user, isAdmin]);

    /** [HOOK] useEffect — carrega a sessão salva e assina mudanças de login/logout. */
    useEffect(() => {
        if (!isSupabaseConfigured) {
            return;
        }

        // 1. Verifica se já existe uma sessão salva no navegador
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser?.email) {
                checkAdminStatus(currentUser.email);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });

        // 2. Ouve eventos de login e logout em tempo real
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser?.email) {
                await checkAdminStatus(currentUser.email);
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => subscription?.unsubscribe?.();
    }, []);

    /** [HOOK] useEffect — monitora interações ativas do usuário para controle de ociosidade. */
    useEffect(() => {
        if (!user || !isAdmin) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        const handleActivity = () => resetInactivityTimer();

        events.forEach((event) => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        // Dispara o primeiro ciclo do temporizador
        resetInactivityTimer();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [user, isAdmin, resetInactivityTimer]);

    // Envia o link mágico para o e-mail
    /** [FUNÇÃO] sendMagicLink — envia o link mágico (OTP) para o e-mail. */
    const sendMagicLink = async (email) => {
        return await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + '/admin',
            },
        });
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, sendMagicLink, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}