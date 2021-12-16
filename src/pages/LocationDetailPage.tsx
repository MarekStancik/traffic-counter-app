import { Box, Grid, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Chart as ChartJS, LinearScale, LineElement, PointElement, Title, CategoryScale } from 'chart.js';
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Link as RouterLink, Navigate, Route, Routes, useParams } from "react-router-dom";
import { tap } from "rxjs";
import LocationContext from "../contexts/location.context";
import useObservable from "../hooks/use-observable.hook";
import useLoading from "../hooks/use-loading.hook";
import locationService from "../services/location.service";
import uiService from "../services/ui.service";
import trafficService from "../services/traffic.service";
import Timeline from "./../components/Timeline";
import { TrafficModel } from "../models/traffic.model";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const StatsPage: React.FC = () => {

    const [startBoundary, setStartBoundary] = useState(new Date());
    const [endBoundary, setEndBoundary] = useState(new Date());
    const [interval, setInterval] = useState(60000);

    const trafficData = useObservable(useLoading(trafficService.latest$));

    const getDataFor = (types: TrafficModel["trafficType"][], interval: number) => {
        const filtered = trafficData!.filter(td => types.includes(td.trafficType)).sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);
        const data = [];
        for (let index = 0; index < filtered.length;) {
            const element = filtered[index];
            const endBoundary = new Date(element.timestamp.getTime() + interval);
            let nextIndex = filtered.findIndex(td => td.timestamp > endBoundary);
            if (nextIndex === -1) nextIndex = filtered.length;
            data.push(nextIndex - index);
            index = nextIndex;
        }

        const firstDate = filtered[0].timestamp.getTime();
        return {
            labels: data.map((_, idx) => new Date(firstDate + idx * interval).toLocaleString("en-US",{ hour: "numeric", minute: "numeric"})),
            datasets: [
                {
                    data,
                    fill: false,
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgba(255, 99, 132, 0.2)",
                    marginLeft: "20px"
                }
            ]
        };
    }

    const chartOptions = {
        scales: {
            y: {
                ticks: {
                    precision: 0
                }
            }
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flex: "1", overflow: "auto" }}>
            <Timeline />
            {trafficData &&
                <Grid sx={{ pl: 6 }} container spacing={6}>
                    <Grid item xs={11}>
                        <Typography sx={{ mt: 1 }} variant="h4">Total</Typography>
                        <Line options={chartOptions} data={getDataFor(["car", "bicycle", "motorbike", "pedestrian"], interval)} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">Cars</Typography>
                        <Line options={chartOptions} data={getDataFor(["car"], interval)} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">TwoWheeled</Typography>
                        <Line options={chartOptions} data={getDataFor(["bicycle", "motorbike"], interval)} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">Pedestrians</Typography>
                        <Line options={chartOptions} data={getDataFor(["pedestrian"], interval)} />
                    </Grid>
                </Grid>
            }
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