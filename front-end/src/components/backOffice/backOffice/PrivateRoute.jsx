import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useEffect } from 'react';

export function PrivateRoute({ children }) {
  
    const location = useLocation();// Se obtiene la ubicación actual
    const from = location.state?.from || '/'; // Aquí se almacena la ruta anterior o '/' si no hay una ruta anterior.
    const navigate = useNavigate();
    const [user, loading] = useAuth();// Se obtiene el usuario y el estado de carga de la petición.

    useEffect(() => {
        if (user) {
            navigate('/backOffice',{ state: { from: location.pathname } });
        }
    }, [user,navigate]);// Si el usuario ya está autenticado se redirige a la página de backOffice

    if(loading) return <div>Loading...</div>;// Mientras se carga la información del usuario se muestra un mensaje de carga
    
    return user ? children : <Navigate to={from} replace />;// Si el usuario está autenticado se muestra el contenido de children, si no se redirige a la página anterior.
}
export default PrivateRoute;