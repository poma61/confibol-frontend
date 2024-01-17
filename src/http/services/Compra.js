import axios from '@/http/connection/axios';

class Compra {
    constructor(ciudad, compra, producto_lote) {
        this.compra = {
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
        if (compra != undefined) {
            this.setAttributes(compra);
        }
    }

    setAttributes(compra) {
        Object.entries(this.compra).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(compra, key)) {
                this.compra[key] = compra[key];
            }
        });
    }

    getAttributes() {
        return this.compra;
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
            const resolve = await axios.post('/compra/edit-data', {
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
            const resolve = await axios.post('/compra/delete-data', {
                ciudad: this.ciudad,
                id: this.getAttributes().id,
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;
        }
    }//destroy

}//class
export default Compra;