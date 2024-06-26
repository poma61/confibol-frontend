import Service from '@/http/services/Service';
import axios from '@/http/connection/axios';

class Personal extends Service {
    constructor(ciudad, personal) {
        super();
        this.setFillable({
            id: 0,
            nombres: "",
            apellido_paterno: "",
            apellido_materno: "",
            cargo: "",
            ci: "",
            ci_expedido: "",
            n_de_contacto: "",
            correo_electronico: "",
            direccion: "",
            foto_image_path: "",
            image_file: null,
        });

        this.setApi({
            index: { url: "/personal/all-data", method: "post" },
            store: { url: "/personal/new-data", method: "post" },
            update: { url: "/personal/edit-data", method: "put" },
            destroy: { url: "/personal/delete-data", method: "post" },
        });

        this.ciudad = ciudad;
        if (personal != undefined) {
            this.setAttributes(personal);
        }

        this.setParameter({
            ciudad: this.ciudad,
        });

        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'multipart/form-data'// de esta forma podemos enviar imagenes
            }
        };
    }

    async recordByCIPersonal() {
        try {
            const resolve = await axios.post("/personal/buscar-personal-por-ci", {
                ci: this.getAttributes().ci,
                ciudad: this.ciudad
            }, this.config);
            return resolve.data;
        } catch (error) {
            if (error.response == undefined || error.response.data == undefined) {
                console.error(error);
                return { status: false, message: error + "" };
            }
            return error.response.data;
        }
    }

}//class
export default Personal;

