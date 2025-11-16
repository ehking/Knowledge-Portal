import Layout from '../components/Layout.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="space-y-4">
                <h2 className="text-3xl font-bold">Welcome, {user?.name}</h2>
                <p className="text-slate-600">
                    Use the Knowledge Portal to share procedures, manuals, and best practices across your teams. Use the
                    sidebar to navigate between dashboards, document management, and uploads.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                    <StatCard label="Documents" value="--" />
                    <StatCard label="Roles" value="Admin / KM / Employee" />
                </div>
            </div>
        </Layout>
    );
};

const StatCard = ({ label, value }) => (
    <div className="rounded bg-white p-4 shadow">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
    </div>
);

export default DashboardPage;
