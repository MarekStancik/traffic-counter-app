import { LocationModel } from "./location.model"

export interface TrafficModel {
    id: string;
    pid?: string;
    location?: LocationModel;
    trafficType: "car" | "pedestrian" | "bicycle" | "motorbike";
    timestamp: Date;
}