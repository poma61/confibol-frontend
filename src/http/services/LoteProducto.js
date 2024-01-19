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
            id_compra: "",
            id_deposito: "",
            id_producto: "",
        });

        this.setApi({
            index: { url: "/lote-producto/all-data", method: "post" },
            store: { url: "/lote-producto/new-data", method: "post" },
            update: { url: "/lote-producto/edit-data", method: "put" },
            destroy: { url: "/lote-producto/delete-data", method: "post" },
        });

        if (lote_producto != undefined) {
            this.setAttributes(lote_producto);
        }

    }//constructor
}//class

export default LoteProducto;
