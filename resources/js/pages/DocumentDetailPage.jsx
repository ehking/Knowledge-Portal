import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import axiosClient from '../api/axiosClient.js';

const DocumentDetailPage = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const { data } = await axiosClient.get(`/documents/${id}`);
                setDocument(data.data ?? data);
            } catch (err) {
                const message = err.response?.data?.message ?? 'Unable to load document';
                setError(message);
            }
        };
        fetchDocument();
    }, [id]);

    return (
        <Layout>
            {error && <p className="text-red-600">{error}</p>}
            {document ? (
                <div className="space-y-4 bg-white rounded shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold">{document.title}</h2>
                            <p className="text-sm text-slate-500">Category: {document.category || '-'}</p>
                        </div>
                        <a
                            className="rounded bg-slate-900 text-white px-4 py-2"
                            href={document.download_url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Download
                        </a>
                    </div>
                    <p>{document.description}</p>
                    <div className="text-sm text-slate-600">
                        <p>Tags: {document.tags?.join(', ') || '-'}</p>
                        <p>Allowed Roles: {document.roles?.join(', ') || '-'}</p>
                        <p>Created By: {document.created_by?.name}</p>
                        <p>Created At: {document.created_at}</p>
                    </div>
                </div>
            ) : (
                !error && <p>Loading...</p>
            )}
        </Layout>
    );
};

export default DocumentDetailPage;
