import { Container, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink, Navigate, Route, Routes, useParams } from "react-router-dom";
import { tap } from "rxjs";
import LocationContext from "../contexts/location.context";
import useObservable from "../hooks/use-observable.hook";
import locationService from "../services/location.service";
import uiService from "../services/ui.service";
import SensorsPage from "./SensorsPage";
import StatsPage from "./StatsPage";

const LocationDetailPage: React.FC = () => {
    return (
        <Container sx={{ display: "flex", flexDirection: "column", flex: "1", overflow: "auto", pt: 1 }}>
            <Typography variant="h5">Coordinates</Typography>
            <Typography></Typography>
        </Container>
    );
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

    const childRoutes = ["general", "stats", "sensors"];

    return (
        <LocationContext.Provider value={{ location }}>
            <div style={{ display: "flex", flexDirection: "row", flex: "1", overflow: "auto" }}>
                <Tabs sx={{ mr: 1, boxShadow: 6 }}
                    orientation="vertical"
                    variant="scrollable"
                    aria-label="detail navigation"
                    value={value}
                    onChange={handleChange}
                >
                    {childRoutes.map(route => <Tab key={route} id={route} component={RouterLink} to={route} label={route} />)}
                </Tabs>
                <Routes>
                    <Route index element={<Navigate to={"general"} />} />
                    <Route path="general" element={<LocationDetailPage />} />
                    <Route path="stats" element={<StatsPage />} />
                    <Route path="sensors" element={<SensorsPage />} />
                </Routes>
            </div>
        </LocationContext.Provider>
    );
}

export default LocationDetailOutlet;