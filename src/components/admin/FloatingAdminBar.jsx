import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import './FloatingAdminBar.css';

export function FloatingAdminBar() {
    const { isAdmin, user, signOut } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    if (!isAdmin) {
        return null;
    }

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (isCollapsed) {
        return (
            <button
                type="button"
                className="admin-bar-collapsed-btn"
                onClick={() => setIsCollapsed(false)}
                title="Expandir barra de gestão LABETA"
                aria-label="Modo gestão ativo. Clique para expandir painel administrativo."
            >
                <ShieldCheck size={18} className="admin-bar-icon" />
                <span className="admin-bar-collapsed-label">Gestão Ativa</span>
                <ChevronUp size={14} />
            </button>
        );
    }

    return (
        <aside className="floating-admin-bar" aria-label="Controles rápidos de administração">
            <div className="admin-bar-main">
                <div className="admin-bar-status">
                    <ShieldCheck size={18} className="admin-bar-icon" />
                    <div className="admin-bar-info">
                        <span className="admin-bar-badge">Modo Gestão Ativo</span>
                        <span className="admin-bar-user" title={user?.email || 'Administrador'}>
                            {user?.email || 'Administrador'}
                        </span>
                    </div>
                </div>

                <div className="admin-bar-actions">
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
