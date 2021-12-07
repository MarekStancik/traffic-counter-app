import { Observable, of } from "rxjs";
import {LocationModel} from "./../models/location.model";

class LocationService {
    public get(id: string): Observable<LocationModel> {
        return of();
    }
};

const locationService = new LocationService();
export default locationService;