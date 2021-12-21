import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Container, FormControl, Grid, InputLabel, MenuItem, Select, Slider, Tab, Tabs, TextField, Typography } from "@mui/material";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Title } from 'chart.js';
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Link as RouterLink, Navigate, Route, Routes, useParams } from "react-router-dom";
import { delay, take, tap } from "rxjs";
import LocationContext from "../contexts/location.context";
import useLoading from "../hooks/use-loading.hook";
import useObservable from "../hooks/use-observable.hook";
import { TrafficModel } from "../models/traffic.model";
import locationService from "../services/location.service";
import trafficService from "../services/traffic.service";
import uiService from "../services/ui.service";

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, Title, CategoryScale);

const StatsPage: React.FC = () => {
    const [timeBoundaries, setTimeBoundaries] = useState([0,24]);
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

    const trafficData = useObservable(useLoading(trafficService.subscribe({ day: selectedDate}).pipe(delay(1000),tap(_ => console.log("emitting")))), selectedDate);
    
    const [interval, setInterval] = useState(60000);

    const handleDateChange = (newValue: Date | null) => {
        newValue && setSelectedDate(newValue);
        console.log(selectedDate)
    };

    const handleIntervalChange = (event: Event, newValue: number | number[]) => {
        setTimeBoundaries(newValue as number[]);
    };


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

        const firstDate = filtered[0]?.timestamp.getTime() || new Date().getTime();
        return {
            labels: data.map((_, idx) => new Date(firstDate + idx * interval).toLocaleString("en-US", { hour: "numeric", minute: "numeric" })),
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
        <Container sx={{ display: "flex", flexDirection: "column", flex: "1", overflow: "auto", pt: 3 }}>
            {/* <Timeline /> */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={6}>
                    <Grid item>
                        <DesktopDatePicker
                            label="Selected Day"
                            inputFormat="MM/dd/yyyy"
                            value={selectedDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Slider getAriaLabel={() => 'Time range'} 
                            valueLabelDisplay="auto" 
                            max={24} 
                            min={0} 
                            value={timeBoundaries} 
                            onChange={handleIntervalChange}/>
                    </Grid>
                    <Grid item>
                        <FormControl>
                            <InputLabel id="select-interval">Interval</InputLabel>
                            <Select
                                labelId="select-interval"
                                id="select"
                                value={interval}
                                label="Interval"
                                onChange={ev => setInterval(ev.target.value as number)}
                            >
                                <MenuItem value={60000}>Minute</MenuItem>
                                <MenuItem value={5 * 60 * 1000}>5 Minutes</MenuItem>
                                <MenuItem value={10 * 60 * 1000}>10 Minutes</MenuItem>
                                <MenuItem value={15 * 60 * 1000}>15 Minutes</MenuItem>
                                <MenuItem value={30 * 60 * 1000}>30 Minutes</MenuItem>
                                <MenuItem value={60 * 60 * 1000}>Hour</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </LocalizationProvider>
            {trafficData &&
                <Grid container spacing={6}>
                    <Grid item xs={11}>
                        <Typography sx={{ mt: 1 }} variant="h4">Total</Typography>
                        <Bar options={chartOptions} data={getDataFor(["car", "bicycle", "motorbike", "pedestrian"], interval)} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">Cars</Typography>
                        <Bar options={chartOptions} data={getDataFor(["car"], interval)} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">TwoWheeled</Typography>
                        <Bar options={chartOptions} data={getDataFor(["bicycle", "motorbike"], interval)} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">Pedestrians</Typography>
                        <Bar options={chartOptions} data={getDataFor(["pedestrian"], interval)} />
                    </Grid>
                </Grid>
            }
        </Container>
    );
}

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