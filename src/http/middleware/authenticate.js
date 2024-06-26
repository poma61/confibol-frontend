import { useAuth } from "@/stores/useAuth";
const LOGIN = 'n-login';

const authenticate = (to, from, next) => {
    const use_auth = useAuth();
    const need_auth = to.matched.some(record => record.meta.requireAuth);

    if (need_auth) {
        //si requiere autenticacion
        if (use_auth.getAuth().state) {
            next();
        } else {
            //si no esta autenticado redirecciona
            next({ name: LOGIN });
        }

    } else {
        //No requiere autenticacion
        next();
    }
}

export default authenticate;