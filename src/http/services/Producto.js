import axios from '@/http/connection/axios';
import Compra from '@/http/services/Compra';
import Categoria from '@/http/services/Categoria';
import Producto from '@/http/services/Producto';
import Deposito from '@/http/services/Deposito';
import toastify from '@/composables/toastify';
//verificar esta clase no esta hecho los metodos index...
//soloe esta hecho los metodos getters y setters

class Producto {
    constructor(compra, categoria, producto, deposito, producto_lote) {
        this.producto_lote = {
            id: 0,
            fecha_vencimiento: "",
            detalle: "",
            cantidad: "",
            costo_unitario: "",
        };
        this.producto = {
            id: 0,
            nombres: "",
            imagen: "",
            id_categoria: "",
        };
        this.compra = new Compra();
        this.categoria = new Categoria();
        this.producto = new Producto();
        this.deposito = new Deposito();
        this.config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        if (compra != undefined) {
            this.setCompra(compra);
        }

        if (categoria != undefined) {
            this.setCategoria(categoria);
        }

        if (producto != undefined) {
            this.setProducto(producto);
        }

        if (deposito != undefined) {
            this.setDeposito(deposito);
        }

        if (producto_lote != undefined) {
            this.setAttributes(producto_lote);
        }

    }

    async index(type) {
        try {
            let resolve;
            switch (type) {
                case "producto":
                    resolve = await axios.post('/producto/all-data', {
                        id_compra: this.compra.getAttributes().id,
                    }, this.config);

                    return resolve.data;

                case "lote-producto":
                    resolve = await axios.post('/lote-producto/all-data', {
                        id_compra: this.compra.getAttributes().id,

                    }, this.config);

                    return resolve.data;


                default: toastify("warning", "Error en el metodo index.")
                    return {};
            }

        } catch (error) {
            return error.response.data;
        }
    }//index

    async store() {
        try {
            const resolve = await axios.post('/producto-lote/new-data', {
                ...this.getAttributes(),
                id_compra: this.compra.getAttributes().id,
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
                ...this.getAttributes(),
                id_compra: this.compra.getAttributes().id,
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;

        }
    }//update

    async destroy() {
        try {
            const resolve = await axios.post('/producto_lote/delete-data', {
                id: this.getAttributes().id,
            }, this.config);
            return resolve.data;

        } catch (error) {
            return error.response.data;
        }
    }//destroy


    setCompra(compra) {
        this.compra.setAttributes("compra", compra)
    }

    getCompra() {
        return this.compra.getAttributes("compra");
    }

    setCategoria(categoria) {
        this.categoria.setAttributes(categoria)
    }

    getCategoria() {
        return this.categoria.getAttributes();
    }

    setProducto(producto) {
        this.producto.setAttributes(producto)
    }

    getProducto() {
        return this.producto.getAttributes();
    }

    setDeposito(deposito) {
        this.deposito.setAttributes(deposito)
    }

    getDeposito() {
        return this.deposito.getAttributes();
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

}//class

export default Producto;

