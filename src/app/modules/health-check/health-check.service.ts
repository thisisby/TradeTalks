import {Redis} from "../../../config/redis";
import {CheckDBResult, DB} from "../../../config/database";

class HealthCheckService {
    async checkRedis() {
        const res = await Redis.client.ping();
        console.log(res)
        if (res === 'PONG') {
            return true;
        } else {
            return false;
        }
    }

    async checkDatabase() {
            const d: CheckDBResult = await DB.CheckDBConnection();
            if(d.result === 2){
                return true;
            } else {
                return false;
            }
    }
}

export default new HealthCheckService();