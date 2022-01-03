import { Box, Breadcrumbs, IconButton, LinearProgress, Link, Paper, Tooltip, Typography, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import React, { useContext } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ColorModeContext from "./../contexts/color-mode.context";
import useObservable from "../hooks/use-observable.hook";
import uiService from "../services/ui.service";
import apiService from "../services/api.service";
import LogoutIcon from '@mui/icons-material/Logout';

// interface NavbarProps {
//     // links?: { href: string, title: string, icon?: React.ReactNode, active?: boolean }[]
//     // isLoading: boolean;
// }

const Navbar: React.FC = () => {

    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const links = useObservable(uiService.links$);
    const isLoading = useObservable(uiService.isLoading$);

    return (
        <Paper>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                width: "inherit",
                borderRadius: 0
            }} >
                <Breadcrumbs sx={{ display: "flex", ml: 1}} aria-label="breadcrumb">
                    {links?.map((l,idx) => l.active 
                        ? 
                        <Typography key={idx} color="text.primary">{l.title}</Typography> 
                        : 
                        <Link key={idx} component={RouterLink} sx={{display: "flex", alignItems: "center"}} underline="hover" color="inherit" to={l.href}>{l.icon}{l.title}</Link>)
                    }
                </Breadcrumbs>
                <IconButton data-cy="theme" sx={{ m: 1, marginLeft: "auto" }} onClick={colorMode.toggleColorMode} color="inherit">
                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <Tooltip title="Logout">
                    <IconButton data-cy="logout" sx={{ m: 1}} onClick={_ => apiService.deauthenticate()} color="inherit">
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            {isLoading && <LinearProgress sx={{mt: -0.5}}/>}
        </Paper>
    );
};

export default Navbar;