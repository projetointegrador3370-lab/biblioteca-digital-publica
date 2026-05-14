import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Categories from './pages/Categories';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminBooks from './pages/AdminBooks';

import { getCurrentUser, getToken, logoutRequest } from './services/auth';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();

        if (!token) {
          setAuthUser(null);
          return;
        }

        const response = await getCurrentUser();
        setAuthUser(response.user);
      } catch (error) {
        console.error('Erro ao validar sessão:', error);
        logoutRequest();
        setAuthUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logoutRequest();
    setAuthUser(null);
  };

  if (authLoading) {
    return (
      <main className="container">
        <section className="loading-page">
          <p>Carregando aplicação...</p>
        </section>
      </main>
    );
  }

  return (
    <BrowserRouter>
      <Navbar authUser={authUser} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/livros/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />

        <Route
          path="/admin"
          element={
            <AdminRoute authUser={authUser}>
              <AdminDashboard authUser={authUser} />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/livros"
          element={
            <AdminRoute authUser={authUser}>
              <AdminBooks />
            </AdminRoute>
          }
        />

        <Route
          path="/conta"
          element={
            <PrivateRoute authUser={authUser}>
              <main className="container">
                <section className="loading-page">
                  <p>Área autenticada pronta para expansão.</p>
                </section>
              </main>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;