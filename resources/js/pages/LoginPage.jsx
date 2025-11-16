import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const LoginPage = () => {
    const { login, loading } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.message ?? 'Invalid username or password';
            setError(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded shadow p-8 space-y-4">
                <h2 className="text-2xl font-semibold text-center">Knowledge Portal Login</h2>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div>
                    <label className="text-sm font-medium text-slate-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 w-full rounded border px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full rounded border px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-slate-900 text-white py-2 hover:bg-slate-800 disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
