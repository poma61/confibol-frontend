import axios from '@/http/connection/axios';
//verificar este archivo 
class Categoria {
    constructor(ciudad, categoria) {
        this.categoria = {
            id: 0,
            nombres: "",
        };
        this.ciudad = ciudad;
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        if (categoria != undefined) {
            this.setAttributes(categoria);
        }
    }

    setAttributes(categoria) {
        Object.entries(this.categoria).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(categoria, key)) {
                this.categoria[key] = categoria[key];
            }
        });
    }

    getAttributes() {
        return this.categoria;
    }

    async index() {
        try {
            const resolve = await axios.post('/categoria/all-data', {
                ciudad: this.ciudad,
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }//index

    async store() {
        try {
            const resolve = await axios.post('/categoria/new-data', {
                ciudad: this.ciudad,
                ...this.getAttributes(),
            }, this.config);
            return resolve.data;

        } catch (error) {

            return error.response.data;
        }
    }//create

    async update() {
        this.config.headers['X-HTTP-Method-Override'] = 'PUT';
        try {
            const resolve = await axios.post('/categoria/edit-data', {
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
            const resolve = await axios.post('/categoria/delete-data', {
                ciudad: this.ciudad,
                id: this.getAttributes().id,
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;
        }
    }//destroy

}//class
export default Categoria;