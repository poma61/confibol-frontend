import Compra from '@/http/services/Compra';
import Producto from '@/http/services/Producto';
import Deposito from '@/http/services/Deposito';
import Service from '@/http/services/Service';

//verificar esta clase no esta hecho los metodos index...
//soloe esta hecho los metodos getters y setters

class LoteProducto extends Service {
    constructor(lote_producto) {
        super();
        this.setFillable({
            id: 0,
            fecha_vencimiento: "",
            detalle: "",
            cantidad: "",
            costo_unitario: "",
        });

        this.setApi({
            index: { url: "/lote-producto/all-data", method: "post" },
            store: { url: "/lote-producto/new-data", method: "post" },
            update: { url: "/lote-producto/edit-data", method: "put" },
            destroy: { url: "/lote-producto/delete-data", method: "post" },
        });

        this.compra = new Compra();
        this.producto = new Producto();
        this.deposito = new Deposito();

        if (lote_producto != undefined) {
            this.setAttributes(lote_producto);
        }

    }//constructor


    setCompra(compra) {
        this.compra.setAttributes(compra)
        this.setParameter({
            id_compra: this.compra.getAttributes().compra.id,
        });
    }

    getCompra() {
        return this.compra.getAttributes();
    }

    setProducto(producto) {
        this.producto.setAttributes(producto);
        this.setParameter({
            id_producto: this.producto.getAttributes().id,
        });
    }

    getProducto() {
        return this.producto.getAttributes();
    }

    setDeposito(deposito) {
        this.deposito.setAttributes(deposito)
        this.setParameter({
            id_deposito: this.deposito.getAttributes().id,
        });
    }

    getDeposito() {
        return this.deposito.getAttributes();
    }

}//class

export default LoteProducto;
