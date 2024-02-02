
import Service from '@/http/services/Service';
import axios from '@/http/connection/axios';

class Role extends Service {
    constructor() {
        super();
    }

    async list() {
        try {
            const resolve = await axios.post("/role/listar", this.config);
            return resolve.data;
        } catch (error) {
            if (error.response == undefined || error.response.data == undefined) {
                console.error(error);
                return { status: false, message: error + "" };
            }
            return error.response.data;
        }
    }
}//class
export default Role;

