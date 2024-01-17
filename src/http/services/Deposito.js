import axios from '@/http/connection/axios';

class Deposito {
    constructor(ciudad, deposito) {
        this.deposito = {
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
        if (deposito != undefined) {
            this.setAttributes(deposito);
        }
    }

    setAttributes(deposito) {
        Object.entries(this.deposito).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(deposito, key)) {
                this.deposito[key] = deposito[key];
            }
        });
    }

    getAttributes() {
        return this.deposito;
    }

    async index() {
        try {
            const resolve = await axios.post('/deposito/all-data', {
                ciudad: this.ciudad,
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }//index

    async store() {
        try {
            const resolve = await axios.post('/deposito/new-data', {
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
            const resolve = await axios.post('/deposito/edit-data', {
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
            const resolve = await axios.post('/deposito/delete-data', {
                ciudad: this.ciudad,
                id: this.getAttributes().id,
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;
        }
    }//destroy

}//class
export default Deposito;