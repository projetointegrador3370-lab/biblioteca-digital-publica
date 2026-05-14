import { Navigate } from 'react-router-dom';

function PrivateRoute({ authUser, children }) {
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;