import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DocumentsListPage from './pages/DocumentsListPage.jsx';
import DocumentUploadPage from './pages/DocumentUploadPage.jsx';
import DocumentDetailPage from './pages/DocumentDetailPage.jsx';
import RequireAuth from './auth/RequireAuth.jsx';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <DashboardPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/documents"
                element={
                    <RequireAuth>
                        <DocumentsListPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/documents/new"
                element={
                    <RequireAuth>
                        <DocumentUploadPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/documents/:id"
                element={
                    <RequireAuth>
                        <DocumentDetailPage />
                    </RequireAuth>
                }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
