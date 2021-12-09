import { Tab, Tabs } from "@mui/material";
import React from "react";
import { Link as RouterLink, Navigate, Route, Routes, useParams } from "react-router-dom";
import { tap } from "rxjs";
import LocationContext from "../contexts/location.context";
import useObservable from "../hooks/use-observable.hook";
import locationService from "../services/location.service";
import uiService from "../services/ui.service";

const LocationDetailPage: React.FC = () => {
    return <div>HII</div>
}


const LocationDetailOutlet: React.FC = () => {

    const { id } = useParams();

    const location = useObservable(locationService.get(id!).pipe(tap(l => uiService.setLinks(
        [
            {
                href: ".",
                title: "Locations",
            }, {
                href: l.id,
                title: l.name,
                active: true
            }
        ]
    ))));

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    const childRoutes = ["general","stats","settings","sensors"];

    return (
        <LocationContext.Provider value={{ location }}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <Tabs sx={{mr: 1}}
                    orientation="vertical"
                    variant="scrollable"
                    aria-label="detail navigation"
                    value={value} 
                    onChange={handleChange}
                >
                    {childRoutes.map(route => <Tab id={route} component={RouterLink} to={route} label={route}/>)}
                </Tabs>
                <Routes>
                    <Route index element={<Navigate to={"general"}/>} />
                    <Route path="general" element={<LocationDetailPage/>}/>
                    <Route path="stats" element={<div>Sup MATE</div>}/>
                </Routes>
            </div>
        </LocationContext.Provider>
    );
}

export default LocationDetailOutlet;