import Service from '@/http/services/Service';

class LoteProducto extends Service {
    constructor(lote_producto) {
        super();
        this.setFillable({
            id: 0,
            fecha_vencimiento: "",
            descripcion: "",
            costo_unitario: "",
            cantidad: "",
            peso_neto: "",
            unidad_medida_peso_neto: "",
            id_producto: "",
            id_compra: "",
            id_deposito: "",
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
