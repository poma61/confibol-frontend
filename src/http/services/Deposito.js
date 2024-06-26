
import Service from '@/http/services/Service';
import axios from '@/http/connection/axios';

class Deposito extends Service {
    constructor(ciudad, deposito) {
        super();
        this.setFillable({
            id: 0,
            nombre_deposito: "",
            direccion: "",
        });

        this.setApi({
            index: { url: "/deposito/all-data", method: "post" },
            store: { url: "/deposito/new-data", method: "post" },
            update: { url: "/deposito/edit-data", method: "put" },
            destroy: { url: "/deposito/delete-data", method: "post" },
        });

        this.ciudad = ciudad;
        if (deposito != undefined) {
            this.setAttributes(deposito);
        }

        this.setParameter({
            ciudad: this.ciudad,
        });
    }

    async list() {
        try {
            const resolve =await axios.post("/deposito/listar", this.config);
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
export default Deposito;

