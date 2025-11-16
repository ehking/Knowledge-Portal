import { useAuth } from '../auth/AuthContext.jsx';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
            <h1 className="text-xl font-semibold text-slate-800">Knowledge Portal</h1>
            <div className="text-sm text-slate-500">{user ? `Logged in as ${user.name}` : ''}</div>
        </header>
    );
};

export default Navbar;
