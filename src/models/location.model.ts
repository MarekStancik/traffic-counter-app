export interface LocationModel {
    id: string;
    name: string;
    childNodes?: LocationModel[];
}