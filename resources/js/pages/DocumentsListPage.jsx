import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import axiosClient from '../api/axiosClient.js';
import { useAuth } from '../auth/AuthContext.jsx';

const DocumentsListPage = () => {
    const { user } = useAuth();
    const canManage = user?.roles?.some((role) => ['admin', 'knowledge_manager'].includes(role));
    const [filters, setFilters] = useState({ q: '', category: '', tag: '' });
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDocuments = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await axiosClient.get('/documents', { params: filters });
            setDocuments(data.data ?? data ?? []);
        } catch (err) {
            setError('Unable to load documents');
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDocuments();
    };

    return (
        <Layout>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Documents</h2>
                    {canManage && (
                        <Link className="rounded bg-slate-900 text-white px-4 py-2" to="/documents/new">
                            Upload
                        </Link>
                    )}
                </div>
                <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-3">
                    <input
                        type="text"
                        placeholder="Search"
                        value={filters.q}
                        onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
                        className="rounded border px-3 py-2"
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={filters.category}
                        onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                        className="rounded border px-3 py-2"
                    />
                    <input
                        type="text"
                        placeholder="Tag"
                        value={filters.tag}
                        onChange={(e) => setFilters((prev) => ({ ...prev, tag: e.target.value }))}
                        className="rounded border px-3 py-2"
                    />
                    <button type="submit" className="rounded bg-slate-900 text-white px-4 py-2">
                        Search
                    </button>
                </form>
                {loading ? (
                    <p>Loading documents...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded shadow">
                            <thead>
                                <tr className="text-left text-sm text-slate-500">
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Tags</th>
                                    <th className="px-4 py-2">Created</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-6 text-center text-slate-500" colSpan="5">
                                            No documents found.
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map((doc) => (
                                        <tr key={doc.id} className="border-t text-sm">
                                            <td className="px-4 py-2 font-medium text-slate-800">{doc.title}</td>
                                            <td className="px-4 py-2">{doc.category || '-'}</td>
                                            <td className="px-4 py-2">{doc.tags?.join(', ') || '-'}</td>
                                            <td className="px-4 py-2">{doc.created_at}</td>
                                            <td className="px-4 py-2 space-x-2">
                                                <Link className="text-slate-900 underline" to={`/documents/${doc.id}`}>
                                                    View
                                                </Link>
                                                <a
                                                    className="text-blue-600 underline"
                                                    href={doc.download_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Download
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default DocumentsListPage;
