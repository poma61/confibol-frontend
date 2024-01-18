
import Service from '@/http/services/Service';

class Deposito extends Service {
    constructor(ciudad, deposito) {
        super();
        this.setFillable({
            id: 0,
            nombres: "",
            direccion: "",
        });

        this.setApi({
            index: { url: "/deposito/all-data", method: "post" },
            store: { url: "/deposito/new-data", method: "post" },
            update: { url: "/deposito/edit-data", method: "put" },
            destroy: { url: "/deposito/delete-data", method: "post" },
        });

        this.ciudad = ciudad;
        if (deposito != undefined) {
            this.setAttributes(deposito);
        }

        this.setParameter({
            ciudad: this.ciudad,
        });
    }


}//class
export default Deposito;

