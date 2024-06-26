
import Service from '@/http/services/Service';

class Usuario extends Service {
    constructor(ciudad, usuario) {
        super();
        //esta parte podriamos enviar en un objeto anidado o en objeto plano
        this.setFillable({
            //usuarios
            id: 0,
            user: "",
            password: "",
            id_personal: "",
            //usuarios_has_roles
            id_role: null,
        });

        this.setApi({
            index: { url: "/usuario/all-data", method: "post" },
            store: { url: "/usuario/new-data", method: "post" },
            update: { url: "/usuario/edit-data", method: "put" },
            destroy: { url: "/usuario/delete-data", method: "post" },
        });

        this.ciudad = ciudad;
        if (usuario != undefined) {
            this.setAttributes(usuario);
        }

        this.setParameter({
            ciudad: this.ciudad,
        });

    }
}//class
export default Usuario;

