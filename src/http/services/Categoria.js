
import Service from '@/http/services/Service';
//verificar este archivo 
class Categoria extends Service {
    constructor(ciudad, deposito) {
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
        if (deposito != undefined) {
            this.setAttributes(deposito);
        }

        this.setParameter({
            ciudad: this.ciudad,
        });
    }
}
export default Categoria;