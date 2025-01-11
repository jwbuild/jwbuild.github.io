import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export function useRedirectHomeUnlessUserIsAdmin({ user }) {
    const navigate = useNavigate();
    useEffect(() => {
        if (!user.isAdmin) {
            navigate('/');
        }
    }, [user, history]);
}
//# sourceMappingURL=useRedirectHomeUnlessUserIsAdmin.js.map