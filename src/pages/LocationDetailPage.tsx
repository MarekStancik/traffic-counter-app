import { Box, Grid, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Chart as ChartJS, LinearScale, LineElement, PointElement, Title, CategoryScale } from 'chart.js';
import React from "react";
import { Line } from "react-chartjs-2";
import { Link as RouterLink, Navigate, Route, Routes, useParams } from "react-router-dom";
import { tap } from "rxjs";
import LocationContext from "../contexts/location.context";
import useObservable from "../hooks/use-observable.hook";
import locationService from "../services/location.service";
import uiService from "../services/ui.service";
import Timeline from "./../components/Timeline";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const StatsPage: React.FC = () => {
    const data = {
        labels: ["1", "2", "3"],
        datasets: [
            {
                label: "Cars",
                data: [23, 34, 22],
                fill: false,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgba(255, 99, 132, 0.2)",
                marginLeft: "20px"
            }
        ]
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flex: "1", overflow: "auto" }}>
            <Timeline />
            <Typography sx={{ mt: 1 }} variant="h4">Total</Typography>
            <Line data={data} />
            <Grid container spacing={6}>
                <Grid item>
                    <Typography variant="h4">Cars</Typography>
                    <Line data={data} />
                </Grid>
                <Grid item>
                    <Typography sx={{ mt: 1 }} variant="h4">Cycles</Typography>
                    <Line data={data} />
                </Grid>
                <Grid item>
                    <Typography sx={{ mt: 1 }} variant="h4">Pedestrians</Typography>
                    <Line data={data} />
                </Grid>
            </Grid>
        </Box>
    );
}

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

    const childRoutes = ["general", "stats", "settings", "sensors"];

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
                </Routes>
            </div>
        </LocationContext.Provider>
    );
}

export default LocationDetailOutlet;