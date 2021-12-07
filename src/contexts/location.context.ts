import { createContext } from "react";
import { LocationModel } from "../models/location.model";

const LocationContext = createContext<{ location: LocationModel | undefined }>({ location: undefined });

export default LocationContext;