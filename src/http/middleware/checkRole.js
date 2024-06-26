import { useAuth } from "@/stores/useAuth";

const checkRole = (to, from, next, roles) => {
    const use_auth = useAuth();
    if (use_auth.hasRole(roles)) {
        next();
    } else {
        next({ path: 'access-denied' });
    }
}
export default checkRole;