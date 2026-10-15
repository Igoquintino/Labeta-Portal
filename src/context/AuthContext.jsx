import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(isSupabaseConfigured);

    // Consulta se o e-mail está na whitelist do banco
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

    // Envia o link mágico para o e-mail
    const sendMagicLink = async (email) => {
        return await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + '/admin',
            },
        });
    };

    // Encerrar sessão
    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, sendMagicLink, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
