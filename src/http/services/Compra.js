import axios from '@/http/connection/axios';
import toastify from '@/composables/toastify';

class Compra {
    constructor(ciudad, compra, documento_compra) {
        this.compra = {
            id: 0,
            nota: "",
            fecha_compra: "",
        };

        this.documento_compra = {
            tipo_compra: "",
            recibo: "",
            factura: "",
            lista_empaque: "",
            poliza: "",
            factura_importacion: "",
            id_compra: "",
        };

        this.ciudad = ciudad;
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        if (compra != undefined) {
            this.setAttributes("compra", compra);
        }

        if (documento_compra != undefined) {
            this.setAttributes("documento-compra", documento_compra);
        }

    }

    setCiudad(ciudad) {
        this.ciudad = ciudad;
    }

    getCiudad() {
        return this.ciudad;
    }

    setAttributes(type, items) {
        switch (type) {
            case "compra":
                Object.entries(this.compra).forEach(([key]) => {
                    if (Object.prototype.hasOwnProperty.call(items, key)) {
                        this.compra[key] = items[key];
                    }
                });
                break;
            case "documento-compra":
                Object.entries(this.documento_compra).forEach(([key]) => {
                    if (Object.prototype.hasOwnProperty.call(items, key)) {
                        this.documento_compra[key] = items[key];
                    }
                });
                break;
            default:
                toastify('warning', "El metodo setAttributes de la clase Compra no pudo obtener ningun tipo.")
                break;
        }//switch
    }

    getAttributes(type) {
        switch (type) {
            case "compra":
                return this.compra;
            case "documento-compra":
                return this.documento_compra;
            default:
                toastify('warning', "El metodo setAttributes de la clase Compra no pudo obtener ningun tipo.")
                return {};
        }//switch

    }

    async index() {
        try {
            const resolve = await axios.post('/compra/all-data', {
                ciudad: this.ciudad,
            }, this.config);

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }//index

    async store() {
        try {
            const resolve = await axios.post('/compra/new-data', {
                ciudad: this.ciudad,
                compra: this.getAttributes("compra"),
                documento_compra: this.getAttributes("documento-compra"),
            }, this.config);
            return resolve.data;

        } catch (error) {

            return error.response.data;
        }
    }//create

    async update() {
        this.config.headers['X-HTTP-Method-Override'] = 'PUT';
        try {
            const resolve = await axios.post('/compra/edit-data', {
                ciudad: this.ciudad,
                compra: this.getAttributes("compra"),
                documento_compra: this.getAttributes("documento-compra"),
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;

        }
    }//update

    async destroy() {
        try {
            const resolve = await axios.post('/compra/delete-data', {
                ciudad: this.ciudad,
                id: this.getAttributes("compra").id,
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;
        }
    }//destroy

}//class
export default Compra;