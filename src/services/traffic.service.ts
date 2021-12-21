import { TrafficModel } from "../models/traffic.model";
import { BehaviorSubject, delay, first, map, Observable, of } from "rxjs";

const initialArray = Array.from({ length: 1000 }, (_, k) => ({
    id: k + "",
    timestamp: new Date(new Date().getTime() + Math.random() * 30 * 60 * 1000),
    trafficType: k % 3 === 0 ? "car" : k % 5 === 0 ? "pedestrian" : "bicycle",
})) as TrafficModel[];

class TrafficService {
    public _list: BehaviorSubject<TrafficModel[]> = new BehaviorSubject(initialArray);

    // public get list$(): Observable<TrafficModel[]> {
    //     return this.list.pipe(delay(1000));
    // }

    public subscribe(filter: { day: Date}): Observable<TrafficModel[]> {
        const start = new Date(filter.day);
        start.setHours(0,0,0,0);

        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        return this._list.pipe(map(records => records.filter(i => i.timestamp > start && i.timestamp < end)));
    }
}

const trafficService = new TrafficService();
export default trafficService;