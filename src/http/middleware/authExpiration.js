import { useAuth } from "@/stores/useAuth";
const LOGIN = 'n-login';
const authExpiration = (to, from, next) => {
    const use_auth = useAuth();
    use_auth.checkExpirationToken();
    next();
}
export default authExpiration;