import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import axiosClient from '../api/axiosClient.js';

const DocumentUploadPage = () => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        roles: 'admin,knowledge_manager,employee',
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!file) {
            setError('Please attach a file');
            return;
        }
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, value));
        formData.append('file', file);

        try {
            setSubmitting(true);
            await axiosClient.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/documents');
        } catch (err) {
            const message = err.response?.data?.message ?? 'Upload failed. Please verify your input.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl space-y-4">
                <h2 className="text-2xl font-semibold">Upload Document</h2>
                {error && <p className="text-red-600">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded shadow p-6">
                    <InputField label="Title" name="title" value={form.title} onChange={handleChange} required />
                    <div>
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="mt-1 w-full rounded border px-3 py-2"
                            rows="3"
                        ></textarea>
                    </div>
                    <InputField label="Category" name="category" value={form.category} onChange={handleChange} />
                    <InputField label="Tags (comma separated)" name="tags" value={form.tags} onChange={handleChange} />
                    <InputField label="Roles (comma separated)" name="roles" value={form.roles} onChange={handleChange} required />
                    <div>
                        <label className="text-sm font-medium text-slate-700">File</label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mt-1 w-full" required />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded bg-slate-900 text-white px-4 py-2 disabled:opacity-50"
                    >
                        {submitting ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

const InputField = ({ label, ...props }) => (
    <div>
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <input {...props} className="mt-1 w-full rounded border px-3 py-2" />
    </div>
);

export default DocumentUploadPage;
