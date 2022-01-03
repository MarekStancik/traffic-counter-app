import { Container, Typography, Select, MenuItem, Grid, Card, CardContent, SelectChangeEvent, Switch, CardActions, FormControl, InputLabel, Stack } from "@mui/material";
import React from "react";
import { switchMap } from "rxjs";
import useLoading from "../hooks/use-loading.hook";
import useObservable from "../hooks/use-observable.hook";
import { SensorModel } from "../models/sensor.model";
import sensorService from "../services/sensor.service";

const SensorsPage: React.FC = () => {
  const [selectedPid, setSelectedPid] = React.useState("");
  const [selectedSensor, setSelectedSensor] = React.useState<SensorModel>();

  const sensors = useObservable(
    useLoading(
      sensorService
        .fetchRecords()
        .pipe(switchMap(() => sensorService.subscribe()))
    )
  );

  const handleSelectedPidChange = (event: SelectChangeEvent<string>) => {
    const pid = event.target.value;
    event && setSelectedPid(pid);
    const sensor = sensors?.find(sensor => sensor.pid === pid);
    sensor && setSelectedSensor(sensor);
  };

  const handleStatusSwitch = (event: any, checked: boolean) => {
    const state = checked ? 'on' : 'off';
    sensorService.partialUpdateRecord(selectedPid, { state }).then(res => {
      setSelectedSensor(res);
    });
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", flex: "1", overflow: "auto", pt: 3, }}>
      <Grid container spacing={4}>
        <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="pid">Raspberry Pi Id</InputLabel>
              <Select 
                label="Raspberry Pi Id" 
                labelId="pid" 
                id="select-pid" 
                value={selectedPid} 
                onChange={handleSelectedPidChange}
              >
                {sensors && sensors.map(sensor => <MenuItem key={sensor.id} value={sensor.pid}>{sensor.pid}</MenuItem>)}
              </Select>
            </FormControl>
        </Grid>
        <Grid item xs={6}>
            <Typography textAlign={'center'} variant="h4">{ selectedPid ? `${selectedPid.toUpperCase()} Settings` : 'Settings' }</Typography>
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={2} />
        <Grid item xs={8}>
          {selectedSensor &&
            <Card variant="outlined">
              <CardContent>
                  <Stack alignItems='center' spacing={4}>
                    <Typography variant="h4">{selectedSensor.pid}</Typography>
                    <FormControl sx={{width:200}}>
                      <InputLabel id="fps">FPS</InputLabel>
                      <Select
                        label="FPS"
                        labelId="fps"
                        id="select-fps"
                        value={30}
                      >
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={27}>27</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="h6">Creation Date: {new Date(selectedSensor.timestamp).toDateString()}</Typography>
                  </Stack>
              </CardContent>
              <CardActions>
                  <Stack marginLeft='auto' marginRight={2} direction='row' spacing={1.5} alignItems='center'>
                    <Typography>Off</Typography>
                    <Switch checked={selectedSensor.state === 'on'} onChange={handleStatusSwitch} />
                    <Typography>On</Typography>
                  </Stack>
              </CardActions>
            </Card>
          }
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </Container>
  );
};

export default SensorsPage;
