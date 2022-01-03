import { BehaviorSubject, defer, delay, from, map, mapTo, Observable, tap } from "rxjs";
import { io } from "socket.io-client";
import { SensorModel } from "../models/sensor.model";
import apiService from "./api.service";

const mapRecord = (record: any): SensorModel => {
    return {
        id: record._id,
        pid: record.pid,
        state: record.state,
        timestamp: new Date(Date.parse(record.timestamp)),
    };
}

const returnRecord = (record: SensorModel): any => {
    return {
        _id: record.id,
        pid: record.pid,
        state: record.state,
        timestamp: record.timestamp,
    };
}

class SensorService {

    private recordsByPid = new BehaviorSubject<SensorModel[]>([]);

    private saveRecord(record: SensorModel) {
        const list = this.recordsByPid;
        list.next([...list.value, record]);
    }

    public constructor() {
        const ws = io(process.env.REACT_APP_API_URL?.split("http").join("ws") || "");
        ws.connect();
        ws.on("sensor-record:added", ev => {
            const record = mapRecord(JSON.parse(ev));
            this.saveRecord(record);
        });
    }

    // public subscribeTo(pid: string): Observable<SensorModel | undefined> {
    //     return this.recordsByPid.pipe(map(records => records.find(i => i.pid === pid)));
    // }

    public subscribe(): Observable<SensorModel[]> {
        return this.recordsByPid.pipe();
    }

    public fetchRecords(): Observable<void> {
        return defer(() => from(apiService.invoke<SensorModel[]>("get",'/settings'))).pipe(
            delay(1000),
            map(records => records?.map(r => mapRecord(r)) || []),
            tap(records => this.recordsByPid.next(records)),
            mapTo(void 0)
        );
    }

    public updateRecord(sensor: SensorModel) {
        const sensorData = returnRecord(sensor);
        return apiService.invoke('put', '/settings', sensorData);
    }

    public partialUpdateRecord(pid: string, partToUpdate: {}) {
        return apiService.invoke('put', `/settings/${pid}`, partToUpdate);
    }
}

const sensorService = new SensorService();
export default sensorService;