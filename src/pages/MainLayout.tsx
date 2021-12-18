import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import LocationOutlet from "./LocationsPage";

const MainLayout: React.FC = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflowY: "auto" }}>
            <Routes>
                <Route path="/" element={<Navigate replace to="/locations"/>}/>
                <Route path="*" element={<Navigate replace to="/" />} />

                <Route path="locations/*" element={<LocationOutlet />} />
            </Routes>
        </Box>
    );
}

export default MainLayout;