import axios from '@/http/connection/axios';
// este archivo aun no esta hecho nada, solo las variables generales estanb actualizado
class ProductoLote {
    constructor(ciudad, producto_lote) {
        this.producto_lote = {
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
        if (producto_lote != undefined) {
            this.setAttributes(producto_lote);
        }
    }

    setAttributes(producto_lote) {
        Object.entries(this.producto_lote).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(producto_lote, key)) {
                this.producto_lote[key] = producto_lote[key];
            }
        });
    }

    getAttributes() {
        return this.producto_lote;
    }

    async index() {
        try {
            const resolve = await axios.post('/producto-lote/all-data', {
                ciudad: this.ciudad,
            }, this.config);

            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }//index

    async store() {
        try {
            const resolve = await axios.post('/producto-lote/new-data', {
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
            const resolve = await axios.post('/producto-lote/edit-data', {
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
            const resolve = await axios.post('/producto-lote/delete-data', {
                ciudad: this.ciudad,
                id: this.getAttributes().id,
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;
        }
    }//destroy

}//class

export default ProductoLote;

