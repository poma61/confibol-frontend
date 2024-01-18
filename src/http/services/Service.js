import axios from '@/http/connection/axios';

class Service {
    constructor() {
        this.fillable = {};
        this.parameter = {};
        this.attribute = { ...this.fillable };
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        this.api = {
            index: { url: "", method: "" },
            store: { url: "", method: "" },
            update: { url: "", method: "" },
            destroy: { url: "", method: "" },
        }
    }

    setAttributes(...args) {
        try {
            let source = args[0]
            //objeto anidado ={atributo:{},atributo2:{},}
            //atributo=> es un objeto.. entonces e sun objeto anidado
            if (Object.values(source).every(value => typeof value == 'object')) {
                //si es un objeto anidado cuando su atributo es de tipo objet
                for (const key in this.attribute) {
                    if (Object.prototype.hasOwnProperty.call(this.attribute, key) && source[key] != undefined) {
                        // funcion recursiva  
                        this.attribute[key] = this.setAttributes(this.attribute[key], source[key]);
                    }
                }
            } else {
                //es un objecto plano
                if (args.length == 2) {
                    //cuando hay dos parametros la funcion se esta ejecutando de forma recursiva
                    let target = args[0];
                    const source = args[1];

                    for (const key in target) {
                        if (Object.prototype.hasOwnProperty.call(target, key) && source[key] != undefined) {
                            target[key] = source[key];
                        }
                    }
                    return target;
                } else {
                    //solo un parametro no se ejecuta de forma recursiva
                    let source = args[0];
                    for (const key in this.attribute) {
                        if (Object.prototype.hasOwnProperty.call(this.attribute, key) && source[key] != undefined) {
                            this.attribute[key] = source[key];
                        }
                    }
                }

            }//else

        } catch (error) {
            console.error(error + "");
        }

    }

    setApi(api) {
        this.api = { ...api }
    }

    getApi() {
        return this.api;
    }

    getAttributes() {
        return this.attribute;
    }

    async index() {
        try {
            let is_method = this.getApi().index.method;
            if (is_method == 'put') {
                this.config.headers['X-HTTP-Method-Override'] = "PUT";
                is_method = "post";
            }
            if (this.emptyObject(this.getParameter())) {
                //true cuando el objeto esta vacio
                const resolve = await axios[is_method](this.getApi().index.url, this.config);
                return resolve.data;
            } else {
                const resolve = await axios[is_method](this.getApi().index.url, this.getParameter(), this.config);
                return resolve.data;
            }

        } catch (error) {
            if (error.response == undefined || error.response.data == undefined) {
                console.error(error);
                return {
                    status: false,
                    message: error + "",
                };
            }
            return error.response.data;
        }
    }//index

    async store() {
        try {
            let is_method = this.getApi().store.method;
            if (is_method == 'put') {
                this.config.headers['X-HTTP-Method-Override'] = "PUT";
                is_method = "post";
            }
            this.setParameter(this.getAttributes());

            const resolve = await axios[is_method](this.getApi().store.url, this.getParameter(), this.config);
            return resolve.data;

        } catch (error) {
            if (error.response == undefined || error.response.data == undefined) {
                console.error(error);
                return {
                    status: false,
                    message: error + "",
                };
            }

            return error.response.data;
        }
    }//create

    async update() {
        let is_method = this.getApi().update.method;
        if (is_method == 'put') {
            this.config.headers['X-HTTP-Method-Override'] = "PUT";
            is_method = "post";
        }

        this.setParameter(this.getAttributes());

        try {
            const resolve = await axios[is_method](this.getApi().update.url, this.getParameter(), this.config);
            return resolve.data;

        } catch (error) {
            if (error.response == undefined || error.response.data == undefined) {
                console.error(error);
                return {
                    status: false,
                    message: error + "",
                };
            }

            return error.response.data;

        }
    }//update

    async destroy() {
        try {
            let is_method = this.getApi().destroy.method;
            if (is_method == 'put') {
                this.config.headers['X-HTTP-Method-Override'] = "PUT";
                is_method = "post";
            }

            this.setParameter(this.getAttributes());

            const resolve = await axios[is_method](this.getApi().destroy.url, this.getParameter(), this.config);
            return resolve.data;

        } catch (error) {
            if (error.response == undefined || error.response.data == undefined) {
                console.error(error);
                return {
                    status: false,
                    message: error + "",
                };
            }

            return error.response.data;
        }

    }//destroy

    setFillable(fillable) {
        this.fillable = fillable;
        this.attribute = { ...this.fillable };
    }

    getFillable() {
        return this.fillable;
    }

    setParameter(parameter) {
        this.parameter = Object.assign(this.parameter, parameter);
    }

    getParameter() {
        return this.parameter;
    }

    emptyObject(obj) {
        //devolvera true si el objeto esta vacio
        return Object.keys(obj).length == 0;
    }

}//class
export default Service;