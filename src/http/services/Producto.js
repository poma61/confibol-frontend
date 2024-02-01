
import Service from '@/http/services/Service';
import axios from '@/http/connection/axios';

//verificar esta clase
class Producto extends Service {
    constructor(producto) {
        super();
        this.setFillable({
            id: 0,
            nombre_producto: "",
            marca: "",
            image_path: "",
            image_file: null,
            categoria: "",
        });
        this.setApi({
            index: { url: "/producto/all-data", method: "post" },
            store: { url: "/producto/new-data", method: "post" },
            update: { url: "/producto/edit-data", method: "put" },
            destroy: { url: "/producto/delete-data", method: "post" },
        });

        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'multipart/form-data'// de esta forma podemos enviar imagenes
            }
        };

        if (producto != undefined) {
            this.setAttributes(producto);
        }
    }//constructor

    async list() {
        try {
            const resolve = await axios.post("/producto/listar", this.config);
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
export default Producto;

