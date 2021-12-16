import { TrafficModel } from "../models/traffic.model";
import { BehaviorSubject, delay, Observable } from "rxjs";

class TrafficService {
    public latest: BehaviorSubject<TrafficModel[]> = new BehaviorSubject(Array.from({ length: 10000 }, (_, k) => ({
        id: k+"",
        timestamp: new Date(new Date().getTime() + Math.random() * 750000),
        trafficType: k % 3 === 0 ? "car" : k % 5 === 0 ? "pedestrian" : "bicycle",
    })) as TrafficModel[]);

    public get latest$(): Observable<TrafficModel[]> {
        return this.latest.pipe(delay(1000)); //Fake loading
    }
}

const trafficService = new TrafficService();
export default trafficService;