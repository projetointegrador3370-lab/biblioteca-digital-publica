import { Navigate } from 'react-router-dom';

function AdminRoute({ authUser, children }) {
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (authUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;