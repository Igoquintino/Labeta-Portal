/* ============================================================
 * [COMPONENTE] FloatingAdminBar
 * Descrição: Barra flutuante "Modo Gestão Ativo" exibida apenas para administradores autenticados.
 *            Possui estado expandido (painel/sair/recolher) e recolhido (botão compacto).
 * Rota/Uso: Renderizada globalmente (App.jsx); retorna null se não for admin.
 * Dados: AuthContext via useAuth (isAdmin, user, signOut).
 * CSS correlato: FloatingAdminBar.css
 * ============================================================ */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import './FloatingAdminBar.css';

/** [FUNÇÃO] FloatingAdminBar — alterna entre barra expandida e botão recolhido. */
export function FloatingAdminBar() {
    // [ESTADO] Sessão administrativa (AuthContext)
    const { isAdmin, user, signOut } = useAuth();
    // [ESTADO] true = barra recolhida em botão compacto
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    if (!isAdmin) {
        return null;
    }

    /** [FUNÇÃO] handleSignOut — encerra a sessão e volta para a Home. */
    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (isCollapsed) {
        return (
            /* [SEÇÃO 1] .admin-bar-collapsed-btn — botão recolhido (estado recolhido) */
            <button
                type="button"
                className="admin-bar-collapsed-btn"
                onClick={() => setIsCollapsed(false)}
                title="Expandir barra de gestão LABETA"
                aria-label="Modo gestão ativo. Clique para expandir painel administrativo."
            >
                {/* [SEÇÃO 1.1] .admin-bar-icon — ícone escudo */}
                <ShieldCheck size={18} className="admin-bar-icon" />
                <span className="admin-bar-collapsed-label">Gestão Ativa</span>
                <ChevronUp size={14} />
            </button>
        );
    }

    return (
        /* [SEÇÃO 2] .floating-admin-bar — barra expandida */
        <aside className="floating-admin-bar" aria-label="Controles rápidos de administração">
            {/* [SEÇÃO 2.1] .admin-bar-main — linha principal */}
            <div className="admin-bar-main">
                {/* [SEÇÃO 2.1.1] .admin-bar-status — ícone + identificação */}
                <div className="admin-bar-status">
                    <ShieldCheck size={18} className="admin-bar-icon" />
                    {/* [SEÇÃO 2.1.1.1] .admin-bar-info — textos */}
                    <div className="admin-bar-info">
                        {/* [SEÇÃO 2.1.1.1.1] .admin-bar-badge — selo "Modo Gestão Ativo" */}
                        <span className="admin-bar-badge">Modo Gestão Ativo</span>
                        {/* [SEÇÃO 2.1.1.1.2] .admin-bar-user — e-mail do usuário */}
                        <span className="admin-bar-user" title={user?.email || 'Administrador'}>
                            {user?.email || 'Administrador'}
                        </span>
                    </div>
                </div>

                {/* [SEÇÃO 2.1.2] .admin-bar-actions — botões de ação */}
                <div className="admin-bar-actions">
                    {/* [SEÇÃO 2.1.2.1] .admin-bar-action-btn.panel — abrir painel */}
                    <button
                        type="button"
                        className="admin-bar-action-btn panel"
                        onClick={() => navigate('/admin')}
                        title="Ir para o Painel Administrativo"
                        aria-label="Abrir página do painel administrativo"
                    >
                        <Settings size={15} />
                        <span>Painel</span>
                    </button>

                    {/* [SEÇÃO 2.1.2.2] .admin-bar-action-btn.logout — sair */}
                    <button
                        type="button"
                        className="admin-bar-action-btn logout"
                        onClick={handleSignOut}
                        title="Encerrar sessão de administração"
                        aria-label="Encerrar sessão de administração"
                    >
                        <LogOut size={15} />
                        <span>Sair</span>
                    </button>

                    {/* [SEÇÃO 2.1.2.3] .admin-bar-collapse-toggle — recolher barra */}
                    <button
                        type="button"
                        className="admin-bar-collapse-toggle"
                        onClick={() => setIsCollapsed(true)}
                        title="Recolher barra de gestão"
                        aria-label="Recolher barra administrativa flutuante"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
