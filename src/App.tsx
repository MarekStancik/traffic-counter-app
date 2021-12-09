import { Box, createTheme, PaletteMode, ThemeProvider } from "@mui/material";
import React, { useMemo, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from "react-router";
import ColorModeContext from "./contexts/color-mode.context";
import useObservable from "./hooks/use-observable.hook";
import LocationOutlet from "./pages/LocationsPage";
import LoginPage from "./pages/LoginPage";
import authenticationService from "./services/authentication.service";

function App() {

    const isAuthed = useObservable(authenticationService.isAuthenticated$);

    // Theme
    const [mode, setMode] = useState<PaletteMode>('dark');
    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode: PaletteMode) =>
                prevMode === 'light' ? 'dark' : 'light',
            );
        },
    }), []);

    const theme = useMemo(() => createTheme({palette: { mode }}), [mode]);

    const rootLayout =
        <Box sx={{
            bgcolor: "background.default",
            color: "text.primary",
            width: "100%",
            height: "inherit",
            display: "flex"
        }}>
            <Outlet />
        </Box>;

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <Routes>
                    <Route path="/" element={rootLayout}>
                        <Route index element={<LoginPage />} />
                        {isAuthed && <>
                            <Route path="locations/*" element={<LocationOutlet/>}/>
                        </>}
                        <Route path="*" element={<Navigate replace to="/"/>}/>
                    </Route>
                </Routes>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
