import { Slider } from "@mui/material";
import { useState } from "react";

const RangeSlider: React.FC<{ onCommit: (value: [number,number]) => void} > = ({onCommit}) => {
    const [boundaries, setBoundaries] = useState([0,24]); // For slider state

    const handleChangeCommitted = (event: any, newValue: number | number[]) => {
        const asArray = newValue as number[];
        setBoundaries(asArray);
        onCommit([asArray[0], asArray[1]]);
    };

    return <Slider getAriaLabel={() => 'Time range'} 
    valueLabelDisplay="auto" 
    max={24} 
    min={0} 
    value={boundaries} 
    onChange={(_,newValue) => setBoundaries(newValue as number[])}
    onChangeCommitted={handleChangeCommitted}/>
};

export default RangeSlider;