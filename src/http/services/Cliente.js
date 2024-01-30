
import Service from '@/http/services/Service';

class Cliente extends Service {
    constructor(ciudad, cliente) {
        super();
        this.setFillable({
            id: 0,
            nombres: "",
            apellido_paterno: "",
            apellido_materno: "",
            n_de_contacto: "",
            correo_electronico: "",
            ci: "",
            ci_expedido: "",
            direccion: "",
            descripcion: "",
            id_grupo: null,
        });

        this.setApi({
            index: { url: "/cliente/all-data", method: "post" },
            store: { url: "/cliente/new-data", method: "post" },
            update: { url: "/cliente/edit-data", method: "put" },
            destroy: { url: "/cliente/delete-data", method: "post" },
        });

        this.ciudad = ciudad;
        if (cliente != undefined) {
            this.setAttributes(cliente);
        }

        this.setParameter({
            ciudad: this.ciudad,
        });
    }

}//class
export default Cliente;

