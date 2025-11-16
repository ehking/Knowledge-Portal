import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const canManage = user?.roles?.some((role) => ['admin', 'knowledge_manager'].includes(role));

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 space-y-4">
            <nav className="space-y-2">
                <SidebarLink to="/dashboard" label="Dashboard" />
                <SidebarLink to="/documents" label="Documents" />
                {canManage && <SidebarLink to="/documents/new" label="Upload Document" />}
            </nav>
            <button
                onClick={logout}
                className="w-full rounded bg-slate-700 px-3 py-2 text-left text-sm hover:bg-slate-600"
            >
                Logout
            </button>
        </aside>
    );
};

const SidebarLink = ({ to, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `block rounded px-3 py-2 text-sm ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}`
        }
    >
        {label}
    </NavLink>
);

export default Sidebar;
