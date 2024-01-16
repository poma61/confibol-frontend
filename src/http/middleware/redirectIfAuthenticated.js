import { useAuth } from "@/stores/useAuth";
const HOME = 'n-inicio';

const redirectIfAuthenticated = (to, from, next) => {
    const use_auth = useAuth();
    //Si es la ruta de login  y el usuario esta autenticado, redirige a la pagina principal
    if (use_auth.getAuth().state && to.path == '/') {
        next({ name: HOME });
    } else {
        next();
    }
}

export default redirectIfAuthenticated;