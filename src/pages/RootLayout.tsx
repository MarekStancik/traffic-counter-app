import { CircularProgress, createTheme, CssBaseline, PaletteMode, ThemeProvider } from "@mui/material";
import React, { useMemo, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import Center from "./../components/Center";
import ColorModeContext from "./../contexts/color-mode.context";
import useObservable from "./../hooks/use-observable.hook";
import LoginPage from "./LoginPage";
import MainLayout from "./MainLayout";
import apiService from "./../services/api.service";

function RootLayout() {

    const apiState = useObservable(apiService.state$);

    let layout: React.ReactNode;
    if (apiState === "init") {
        layout = (
            <Center>
                <CircularProgress />
            </Center>
        );
    } else if (apiState === "unauthenticated") {
        layout = <LoginPage />;
    } else if (apiState === "authenticated") {
        layout = <MainLayout />;
    }


    // Theme
    const [mode, setMode] = useState<PaletteMode>('dark');
    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode: PaletteMode) =>
                prevMode === 'light' ? 'dark' : 'light',
            );
        },
    }), []);

    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <BrowserRouter>
                    {layout}
                </BrowserRouter>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default RootLayout;
