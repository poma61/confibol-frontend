
import Service from '@/http/services/Service';

class Compra extends Service {
    constructor(ciudad, by_compra) {
        super();
        this.setFillable({
            compra: {
                id: 0,
                nota: "",
                fecha_compra: "",
            },
            documento_compra: {
                tipo_compra: "",
                recibo: "",
                factura_nacional: "",
                lista_empaque: "",
                poliza: "",
                factura_importacion: "",
                id_compra: "",
            },
        });

        this.setApi({
            index: { url: "/compra/all-data", method: "post" },
            store: { url: "/compra/new-data", method: "post" },
            update: { url: "/compra/edit-data", method: "put" },
            destroy: { url: "/compra/delete-data", method: "post" },
        });

        this.ciudad = ciudad;
        if (by_compra != undefined) {
            this.setAttributes(by_compra);
        }

        this.setParameter({
            ciudad: this.ciudad,
        });
    }

}//class
export default Compra;