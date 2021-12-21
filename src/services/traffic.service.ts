import { BehaviorSubject, map, Observable } from "rxjs";
import { TrafficModel } from "../models/traffic.model";

const startOfTimes = new Date("1/1/2021");
const now = new Date();

const initialArray = Array.from({ length: 100000 }, (_, k) => ({
    id: k + "",
    timestamp: new Date(startOfTimes.getTime() + Math.random() * (now.getTime() - startOfTimes.getTime())),
    trafficType: k % 3 === 0 ? "car" : k % 5 === 0 ? "pedestrian" : "bicycle",
})) as TrafficModel[];

class TrafficService {
    public _list: BehaviorSubject<TrafficModel[]> = new BehaviorSubject(initialArray);

    public subscribe(filter: { day: Date, startHour: number, endHour: number}): Observable<TrafficModel[]> {
        const start = new Date(filter.day);
        start.setHours(filter.startHour,0,0,0);

        const end = new Date(start);
        end.setHours(filter.endHour, 0, 0, 0);
        return this._list.pipe(map(records => records.filter(i => i.timestamp > start && i.timestamp < end)));
    }
}

const trafficService = new TrafficService();
export default trafficService;