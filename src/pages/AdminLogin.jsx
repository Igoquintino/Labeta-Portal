/* ============================================================
 * [COMPONENTE] AdminLogin
 * Descrição: Login silencioso da gestão: envio de link mágico (Supabase) e painel de sessão conectada.
 * Rota/Uso: Rota /admin (não listada na Navbar).
 * Dados: AuthContext (user, isAdmin, sendMagicLink, signOut)
 * CSS correlato: AdminLogin.css
 * ============================================================ */
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { ShieldCheck, LogOut, CheckCircle2, AlertCircle, Mail, Loader2 } from 'lucide-react';
import './AdminLogin.css';

/** [FUNÇÃO] AdminLogin — alterna entre formulário de e-mail e card de usuário conectado. */
export default function AdminLogin() {
    const { user, isAdmin, loading, sendMagicLink, signOut } = useAuth();
    // [ESTADO] email — e-mail digitado
    const [email, setEmail] = useState('');
    // [ESTADO] enviado — link mágico já enviado
    const [enviado, setEnviado] = useState(false);
    // [ESTADO] enviando — requisição em andamento
    const [enviando, setEnviando] = useState(false);
    // [ESTADO] erroMsg — mensagem de erro exibida ao usuário
    const [erroMsg, setErroMsg] = useState('');

    /** [FUNÇÃO] handleLogin — envia o link mágico para o e-mail informado. */
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
            /* [SEÇÃO 1] .admin-loading-container — <div> */
            <div className="admin-loading-container">
                {/* [SEÇÃO 1.1] .animate-spin — <Loader2> */}
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        /* [SEÇÃO 2] .admin-login-page — <main> */
        <main className="admin-login-page" id="main-content">
            {/* [SEÇÃO 2.1] .admin-login-header — <div> */}
            <div className="admin-login-header">
                {/* [SEÇÃO 2.1.1] .admin-shield-icon — <ShieldCheck> */}
                <ShieldCheck size={48} className="admin-shield-icon" />
                {/* [SEÇÃO 2.1.2] .admin-login-title — <h1> */}
                <h1 className="admin-login-title">Painel Administrativo LABETA</h1>
                {/* [SEÇÃO 2.1.3] .admin-login-subtitle — <p> */}
                <p className="admin-login-subtitle">
                    Acesso restrito para coordenação e equipe autorizada
                </p>
            </div>

            {!user ? (
                /* [SEÇÃO 2.1.4] .admin-login-card — <div> */
                <div className="admin-login-card">
                    {enviado ? (
                        /* [SEÇÃO 2.1.4.1] .admin-login-success-view — <div> */
                        <div className="admin-login-success-view">
                            {/* [SEÇÃO 2.1.4.1.1] .admin-success-icon — <CheckCircle2> */}
                            <CheckCircle2 size={40} className="admin-success-icon" />
                            {/* [SEÇÃO 2.1.4.1.2] .admin-success-title — <h2> */}
                            <h2 className="admin-success-title">Verifique seu e-mail!</h2>
                            {/* [SEÇÃO 2.1.4.1.3] .admin-success-desc — <p> */}
                            <p className="admin-success-desc">
                                Enviamos um link de confirmação para <strong>{email}</strong>. Abra o link na sua caixa de entrada para entrar diretamente.
                            </p>
                        </div>
                    ) : (
                        /* [SEÇÃO 2.1.4.2] .admin-login-form — <form> */
                        <form onSubmit={handleLogin} className="admin-login-form">
                            {/* [SEÇÃO 2.1.4.2.1] .admin-input-wrapper — <div> */}
                            <div className="admin-input-wrapper">
                                {/* [SEÇÃO 2.1.4.2.1.1] .admin-login-label — <label> */}
                                <label className="admin-login-label">
                                    E-mail institucional ou autorizado
                                </label>
                                {/* [SEÇÃO 2.1.4.2.1.2] .admin-input-group — <div> */}
                                <div className="admin-input-group">
                                    {/* [SEÇÃO 2.1.4.2.1.2.1] .admin-input-icon — <Mail> */}
                                    <Mail size={16} className="admin-input-icon" />
                                    {/* [SEÇÃO 2.1.4.2.1.2.2] .admin-login-input — <input> */}
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
                                /* [SEÇÃO 2.1.4.2.1.3] .admin-login-error — <div> */
                                <div className="admin-login-error">
                                    <AlertCircle size={14} />
                                    <span>{erroMsg}</span>
                                </div>
                            )}

                            {/* [SEÇÃO 2.1.4.2.2] .admin-login-submit-btn — <button> */}
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
                /* [SEÇÃO 2.1.5] .admin-login-card .admin-connected-card — <div> */
                <div className="admin-login-card admin-connected-card">
                    {/* [SEÇÃO 2.1.5.1] .admin-connected-label — <p> */}
                    <p className="admin-connected-label">Conectado como:</p>
                    {/* [SEÇÃO 2.1.5.2] .admin-connected-email — <strong> */}
                    <strong className="admin-connected-email">{user.email}</strong>

                    {isAdmin ? (
                        /* [SEÇÃO 2.1.5.2.1] .admin-role-badge .recognized — <div> */
                        <div className="admin-role-badge recognized">
                            <CheckCircle2 size={16} />
                            <span>Administrador Reconhecido</span>
                        </div>
                    ) : (
                        /* [SEÇÃO 2.1.5.2.2] .admin-role-badge .unrecognized — <div> */
                        <div className="admin-role-badge unrecognized">
                            <AlertCircle size={16} />
                            <span>E-mail sem permissão administrativa</span>
                        </div>
                    )}

                    <div>
                        {/* [SEÇÃO 2.1.5.3.1] .admin-logout-action-btn — <button> */}
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