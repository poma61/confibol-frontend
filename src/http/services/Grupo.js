
import Service from '@/http/services/Service';
import axios from '@/http/connection/axios';

class Grupo extends Service {
    constructor(ciudad, grupo) {
        super();
        this.setFillable({
            id: 0,
            nombre_grupo: "",
            descripcion: "",
        });

        this.setApi({
            index: { url: "/grupo/all-data", method: "post" },
            store: { url: "/grupo/new-data", method: "post" },
            update: { url: "/grupo/edit-data", method: "put" },
            destroy: { url: "/grupo/delete-data", method: "post" },
        });

        this.ciudad = ciudad;
        if (grupo != undefined) {
            this.setAttributes(grupo);
        }

        this.setParameter({
            ciudad: this.ciudad,
        });
    }

    async list() {
        try {
            const resolve = await axios.post("/grupo/listar", this.getParameter(), this.config);
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
export default Grupo;

