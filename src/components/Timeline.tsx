import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Timeline: React.FC = () => {

    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    return (
        <Box sx={{
            display: "flex",
            flexFlow: "row",
            alignItems: "center",
            width: "100%",
            mt: 3
        }}>
            <Box sx={{
                 height: "6px",
                 width: "100%",
                 bgcolor: "primary.main",
                 borderRadius: 3,
                 position: "relative",
                 ml: 6, 
                 mr: 6
            }}>
                21.12.2021
            </Box>
            
            <Tooltip title="Latest">
                <IconButton sx={{m: 1}}>
                    <AccessTimeIcon/>
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default Timeline;