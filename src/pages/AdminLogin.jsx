import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { ShieldCheck, LogOut, CheckCircle2, AlertCircle, Mail, Loader2 } from 'lucide-react';

export default function AdminLogin() {
    const { user, isAdmin, loading, sendMagicLink, signOut } = useAuth();
    const [email, setEmail] = useState('');
    const [enviado, setEnviado] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [erroMsg, setErroMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setErroMsg('');

        const { error } = await sendMagicLink(email.trim().toLowerCase());

        if (error) {
            setErroMsg(error.message);
        } else {
            setEnviado(true);
        }
        setEnviando(false);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <main style={{ padding: '6rem 1.5rem', maxWidth: '460px', margin: '0 auto', color: 'var(--text-primary)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <ShieldCheck size={48} color="var(--color-gold)" style={{ marginBottom: '0.75rem' }} />
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Painel Administrativo LABETA</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Acesso restrito para coordenação e equipe autorizada
                </p>
            </div>

            {!user ? (
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-card)'
                }}>
                    {enviado ? (
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <CheckCircle2 size={40} color="var(--color-green-light)" style={{ marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Verifique seu e-mail!</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                                Enviamos um link de confirmação para <strong>{email}</strong>. Abra o link na sua caixa de entrada para entrar diretamente.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                    E-mail institucional ou autorizado
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="seu.email@exemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px 10px 38px',
                                            backgroundColor: 'var(--bg-primary)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'var(--text-primary)',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {erroMsg && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E07A5F', fontSize: '0.8rem' }}>
                                    <AlertCircle size={14} />
                                    <span>{erroMsg}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={enviando}
                                style={{
                                    padding: '10px',
                                    backgroundColor: 'var(--color-green-moss)',
                                    color: 'var(--color-gold)',
                                    border: '1px solid var(--color-gold)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: '600',
                                    cursor: enviando ? 'not-allowed' : 'pointer',
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {enviando && <Loader2 className="animate-spin" size={16} />}
                                {enviando ? 'Enviando link...' : 'Enviar Link de Acesso'}
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                /* Painel para quem já está conectado */
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Conectado como:</p>
                    <strong style={{ display: 'block', margin: '0.4rem 0 1.5rem', color: 'var(--color-gold)' }}>{user.email}</strong>

                    {isAdmin ? (
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            backgroundColor: 'rgba(78, 168, 110, 0.15)',
                            border: '1px solid var(--color-green-light)',
                            borderRadius: '20px',
                            color: 'var(--color-green-light)',
                            fontSize: '0.85rem',
                            marginBottom: '1.5rem'
                        }}>
                            <CheckCircle2 size={16} />
                            <span>Administrador Reconhecido</span>
                        </div>
                    ) : (
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            backgroundColor: 'rgba(224, 122, 95, 0.15)',
                            border: '1px solid #E07A5F',
                            borderRadius: '20px',
                            color: '#E07A5F',
                            fontSize: '0.85rem',
                            marginBottom: '1.5rem'
                        }}>
                            <AlertCircle size={16} />
                            <span>E-mail sem permissão administrativa</span>
                        </div>
                    )}

                    <div>
                        <button
                            onClick={signOut}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            <LogOut size={14} /> Sair da conta
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}