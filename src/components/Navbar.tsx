import { Breadcrumbs, IconButton, Link, Paper, Typography, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import React, { useContext } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ColorModeContext from "./../contexts/color-mode.context";

interface NavbarProps {
    links?: { href: string, title: string, icon?: React.ReactNode, active?: boolean }[]
}

const Navbar: React.FC<NavbarProps> = ({links}) => {

    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <Paper sx={{
            ml: "1px",
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
            <IconButton sx={{ m: 1, marginLeft: "auto" }} onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Paper>
    );
};

export default Navbar;