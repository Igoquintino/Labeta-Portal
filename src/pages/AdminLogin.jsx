import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { ShieldCheck, LogOut, CheckCircle2, AlertCircle, Mail, Loader2 } from 'lucide-react';
import './AdminLogin.css';

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
            <div className="admin-loading-container">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <main className="admin-login-page" id="main-content">
            <div className="admin-login-header">
                <ShieldCheck size={48} className="admin-shield-icon" />
                <h1 className="admin-login-title">Painel Administrativo LABETA</h1>
                <p className="admin-login-subtitle">
                    Acesso restrito para coordenação e equipe autorizada
                </p>
            </div>

            {!user ? (
                <div className="admin-login-card">
                    {enviado ? (
                        <div className="admin-login-success-view">
                            <CheckCircle2 size={40} className="admin-success-icon" />
                            <h2 className="admin-success-title">Verifique seu e-mail!</h2>
                            <p className="admin-success-desc">
                                Enviamos um link de confirmação para <strong>{email}</strong>. Abra o link na sua caixa de entrada para entrar diretamente.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="admin-login-form">
                            <div className="admin-input-wrapper">
                                <label className="admin-login-label">
                                    E-mail institucional ou autorizado
                                </label>
                                <div className="admin-input-group">
                                    <Mail size={16} className="admin-input-icon" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="seu.email@exemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="admin-login-input"
                                    />
                                </div>
                            </div>

                            {erroMsg && (
                                <div className="admin-login-error">
                                    <AlertCircle size={14} />
                                    <span>{erroMsg}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={enviando}
                                className="admin-login-submit-btn"
                            >
                                {enviando && <Loader2 className="animate-spin" size={16} />}
                                {enviando ? 'Enviando link...' : 'Enviar Link de Acesso'}
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                /* Painel para quem já está conectado */
                <div className="admin-login-card admin-connected-card">
                    <p className="admin-connected-label">Conectado como:</p>
                    <strong className="admin-connected-email">{user.email}</strong>

                    {isAdmin ? (
                        <div className="admin-role-badge recognized">
                            <CheckCircle2 size={16} />
                            <span>Administrador Reconhecido</span>
                        </div>
                    ) : (
                        <div className="admin-role-badge unrecognized">
                            <AlertCircle size={16} />
                            <span>E-mail sem permissão administrativa</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="button"
                            onClick={signOut}
                            className="admin-logout-action-btn"
                        >
                            <LogOut size={14} /> Sair da conta
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}