import axios from '@/http/connection/axios';
// este archivo aun no esta hecho nada, solo las variables generales estanb actualizado
class Producto {
    constructor(ciudad, producto) {
        this.producto = {
            id: 0,
            nombres: "",
            direccion: "",
        };
        this.ciudad = ciudad;
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        if (producto != undefined) {
            this.setAttributes(producto);
        }
    }

    setAttributes(producto) {
        Object.entries(this.producto).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(producto, key)) {
                this.producto[key] = producto[key];
            }
        });
    }

    getAttributes() {
        return this.producto;
    }

    async index() {
        try {
            const resolve = await axios.post('/producto/all-data', {
                ciudad: this.ciudad,
            }, this.config);

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }//index

    async store() {
        try {
            const resolve = await axios.post('/producto/new-data', {
                ciudad: this.ciudad,
                ...this.getAttributes()
            }, this.config);
            return resolve.data;

        } catch (error) {

            return error.response.data;
        }
    }//create

    async update() {
        this.config.headers['X-HTTP-Method-Override'] = 'PUT';
        try {
            const resolve = await axios.post('/producto/edit-data', {
                ciudad: this.ciudad,
                ...this.getAttributes(),
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;

        }

    }//update

    async destroy() {
        try {
            const resolve = await axios.post('/producto/delete-data', {
                ciudad: this.ciudad,
                id: this.getAttributes().id,
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;
        }
    }//destroy

}//class
export default Producto;