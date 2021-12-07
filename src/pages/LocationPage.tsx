import { Box } from "@mui/material";
import React from "react";
import { Outlet, Route, Routes, useParams } from "react-router-dom";
import LocationContext from "../contexts/location.context";
import useObservable from "../hooks/use-observable.hook";
import locationService from "../services/location.service";
import Navbar from "../components/Navbar";

const LocationOutlet: React.FC = () => {

    const { id } = useParams();

    const location = useObservable(locationService.get(id!));
    
    return (
        <LocationContext.Provider value={{location}}>
            <Navbar/>
            <Routes>
                <Route index element={<LocationPage />} />
            </Routes>
            <Outlet/>
        </LocationContext.Provider>
    );
};

const LocationPage: React.FC = () => {
    return (
        <Box>
            
        </Box>
    );
};

export default LocationOutlet;