
import Service from '@/http/services/Service';

class Compra extends Service{
    constructor(ciudad, compra_by_documento_comp) {
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
                factura: "",
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
        if (compra_by_documento_comp != undefined) {
            this.setAttributes(compra_by_documento_comp);
        }

        this.setParameter({
            ciudad: this.ciudad,
        });
    }


}//class
export default Compra;