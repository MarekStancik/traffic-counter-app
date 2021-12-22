import { BehaviorSubject, defer, delay, from, map, mapTo, Observable, tap } from "rxjs";
import { TrafficModel } from "../models/traffic.model";
import { io } from "socket.io-client";
import apiService from "./api.service";

const startOfTimes = new Date("1/1/2021");
const now = new Date();

const initialArray = Array.from({ length: 100000 }, (_, k) => ({
    id: k + "",
    timestamp: new Date(startOfTimes.getTime() + Math.random() * (now.getTime() - startOfTimes.getTime())),
    trafficType: k % 3 === 0 ? "car" : k % 5 === 0 ? "pedestrian" : "bicycle",
})) as TrafficModel[];

const mapRecord = (record: any): TrafficModel => {
    return {
        trafficType: record.trafficType,
        timestamp: new Date(Date.parse(record.timestamp)),
        pid: record.pid,
        id: record._id
    };
}

class TrafficService {

    private recordsByDays: { [key: string]: BehaviorSubject<TrafficModel[]>} = {};

    private saveRecord(record: TrafficModel) {
        const list = this.getListFor(record.timestamp);
        list.next([...list.value, record]);
    }

    private getListFor(day: Date): BehaviorSubject<TrafficModel[]> {
        const key = day.toDateString();
        if (!this.recordsByDays[key]) {
            this.recordsByDays[key] = new BehaviorSubject([] as TrafficModel[]);
        }
        return this.recordsByDays[key];

    }

    public constructor() {
        const ws = io(process.env.REACT_APP_API_URL?.split("http").join("ws") || "");
        ws.connect();
        ws.on("traffic-record:added", ev => {
            const record = mapRecord(JSON.parse(ev));
            this.saveRecord(record);
        });
    }

    public subscribe(filter: { day: Date, startHour: number, endHour: number }): Observable<TrafficModel[]> {
        const start = new Date(filter.day);
        start.setHours(filter.startHour, 0, 0, 0);

        const end = new Date(start);
        end.setHours(filter.endHour, 0, 0, 0);
        return this.getListFor(filter.day).pipe(map(records => records.filter(i => i.timestamp > start && i.timestamp < end)));
    }

    public fetchRecordsFor(day: Date): Observable<void> {
        return defer(() => from(apiService.invoke<TrafficModel[]>("get",`/traffic?day=${day.getTime()}`))).pipe(
            delay(1000),
            map(records => records?.map(r => mapRecord(r)) || []),
            tap(records => this.getListFor(day).next(records)),
            mapTo(void 0)
        );
    }
}

const trafficService = new TrafficService();
export default trafficService;