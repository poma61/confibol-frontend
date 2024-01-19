
import Service from '@/http/services/Service';
//verificar este archivo 
class Categoria extends Service {
    constructor(ciudad, categoria) {
        super();
        this.setFillable({
            id: 0,
            nombres: "",
            direccion: "",
        });

        this.setApi({
            index: { url: "/categoria/all-data", method: "post" },
            store: { url: "/categoria/new-data", method: "post" },
            update: { url: "/categoria/edit-data", method: "put" },
            destroy: { url: "/categoria/delete-data", method: "post" },
        });

        this.ciudad = ciudad;
        if (Service != undefined) {
            this.setAttributes(Service);
        }

        this.setParameter({
            ciudad: this.ciudad,
        });
    }
}
export default Categoria;