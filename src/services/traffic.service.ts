import { TrafficModel } from "../models/traffic.model";
import { BehaviorSubject, delay, Observable } from "rxjs";

const initialArray = Array.from({ length: 1000 }, (_, k) => ({
    id: k + "",
    timestamp: new Date(new Date().getTime() + Math.random() * 30 * 60 * 1000),
    trafficType: k % 3 === 0 ? "car" : k % 5 === 0 ? "pedestrian" : "bicycle",
})) as TrafficModel[];

class TrafficService {
    public list: BehaviorSubject<TrafficModel[]> = new BehaviorSubject(initialArray);

    public get list$(): Observable<TrafficModel[]> {
        return this.list.pipe(delay(1000));
    }

    // public getAll(): Promise<> {
    //     return fetch()
    //     // return this.http.get<T[]>(`${environment.apiUrl}/v1/${this.path}`)
    //     //     .subscribe({
    //     //         next: l => this.list$.next(l),
    //     //         error: err => {
    //     //             console.log(err);
    //     //             this.list$.next([]);
    //     //         }
    //     //     });
    // }
}

const trafficService = new TrafficService();
export default trafficService;