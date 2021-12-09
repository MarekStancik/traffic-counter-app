import { delay, Observable, of } from "rxjs";
import { LocationModel } from "./../models/location.model";

const initialLocations: LocationModel[] = [
    {
        id: "1",
        name: "Esbjerg",
        childNodes: [
            {
                id: "2",
                name: "Stormgade",
                childNodes: [
                    {
                        id: "4",
                        name: "Next to the REMMA"
                    },
                    {
                        id: "5",
                        name: "Start of the street"
                    }
                ]
            }, {
                id: "3",
                name: "Strandbygade"
            }
        ]
    }, {
        id: "10",
        name: "Kolding",
        childNodes: [
            {
                id: "11",
                name: "Random Danish Street"
            }
        ]
    }
];

class LocationService {

    public list(): Observable<LocationModel[]> {
        return of(initialLocations).pipe(delay(1000));
    }

    public get(id: string): Observable<LocationModel> {
        const find = (l: LocationModel, id: string): LocationModel | undefined => {
            return l.id === id ? l 
                : l.childNodes && l.childNodes.length > 0 ? l.childNodes.map(child => find(child, id)).find(ch => !!ch) 
                    : undefined;
        }
        return of(find({id: "nonexisting", name: "", childNodes: initialLocations}, id)!);
    }
};

const locationService = new LocationService();
export default locationService;