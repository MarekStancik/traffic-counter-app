import { LocalizationProvider, DesktopDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Container, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Title } from 'chart.js';
import React from "react";
import { Bar } from "react-chartjs-2";
import { switchMap } from "rxjs";
import RangeSlider from "../components/RangeSlider";
import useLoading from "../hooks/use-loading.hook";
import useObservable from "../hooks/use-observable.hook";
import { TrafficModel } from "../models/traffic.model";
import trafficService from "../services/traffic.service";

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, Title, CategoryScale);

const StatsPage: React.FC = () => {
    const [[startHour, endHour], setTimeBoundaries] = React.useState([0, 24]);
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

    const trafficData = useObservable(useLoading(trafficService.fetchRecordsFor(selectedDate).pipe(
        switchMap(() => trafficService.subscribe({
            day: selectedDate,
            startHour: startHour,
            endHour: endHour
        }))
    )), selectedDate, startHour, endHour);

    const [interval, setInterval] = React.useState(5);

    const handleDateChange = (newValue: Date | null) => {
        newValue && setSelectedDate(newValue);
    };


    const getDataFor = (types: TrafficModel["trafficType"][], interval: number) => {
        const filtered = trafficData!.filter(td => types.includes(td.trafficType)).sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);
        const data = [];

        const dates: Date[] = [];
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0,0,0,0);
        for (let s = startHour * 60; s < endHour * 60; s += interval) {
            dates.push(new Date(startOfDay.getTime() + s * 60 * 1000));
        }

        for (let index = 0, dateIdx = 0; index < filtered.length && dateIdx < dates.length; dateIdx++) {
            const start = dates[dateIdx];
            const end = new Date(start.getTime() + interval * 60 * 1000);
            let count = 0;
            while (index < filtered.length && filtered[index].timestamp > start && filtered[index].timestamp < end) {
                ++count; ++index;
            }
            data.push(count);
        }

        return {
            labels: dates.map(d => d.toLocaleString("en-GB", { hour: "numeric", minute: "numeric" })),
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
                        <RangeSlider onCommit={values => setTimeBoundaries(values)} />
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
                                <MenuItem value={5}>5 Minutes</MenuItem>
                                <MenuItem value={10}>10 Minutes</MenuItem>
                                <MenuItem value={15}>15 Minutes</MenuItem>
                                <MenuItem value={30}>30 Minutes</MenuItem>
                                <MenuItem value={60}>Hour</MenuItem>
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

export default StatsPage;