import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TreeItem, TreeItemContentProps, useTreeItem } from "@mui/lab";
import TreeView from '@mui/lab/TreeView';
import { Box, Container, Link, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useEffect } from "react";
import { Link as RouterLink, Outlet, Route, Routes } from "react-router-dom";
import { tap } from "rxjs";
import Navbar from "../components/Navbar";
import useLoading from "../hooks/use-loading.hook";
import useObservable from "../hooks/use-observable.hook";
import { LocationModel } from "../models/location.model";
import locationService from "../services/location.service";
import uiService from "../services/ui.service";
import LocationDetailOutlet from "./LocationDetailPage";

const LocationOutlet: React.FC = () => {

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flex: "1 1 auto" }}>
            <Navbar />
            <Routes>
                <Route index element={<LocationsPage />} />
                {/* <Route path="new" element={}/> */}
                <Route path=":id/*" element={<LocationDetailOutlet />} />
            </Routes>
            <Outlet />
        </Box>
    );
};

const CustomContent = React.forwardRef((props: TreeItemContentProps, ref) => {
    const { classes, className, label, nodeId, icon: iconProp, expansionIcon, displayIcon } = props;

    const { disabled, expanded, selected, focused, handleExpansion, preventSelection } = useTreeItem(nodeId);

    const icon = iconProp || expansionIcon || displayIcon;

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={clsx(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled,
            })}
            onMouseDown={preventSelection}
            ref={ref as React.Ref<HTMLDivElement>}
        >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div onClick={handleExpansion} className={classes.iconContainer}>
                {icon}
            </div>
            <Link
                component={RouterLink}
                className={classes.label}
                to={nodeId}
            >
                {label}
            </Link>
        </div>
    );
});

const LocationsPage: React.FC = () => {
    // Trigger on mount due to : https://stackoverflow.com/a/63424831
    useEffect(() => {
        uiService.setLinks([{
            href: ".",
            title: "Locations",
            active: true
        }]);
    }, []);

    const locations = useObservable(useLoading(locationService.list()));

    if (!locations) return <></>;

    const mapLocation = (location: LocationModel) => {
        return <TreeItem key={location.id}
            nodeId={location.id}
            label={location.name}
            ContentComponent={CustomContent}
        >
            {location.childNodes && location.childNodes.map(l => mapLocation(l))}
        </TreeItem>
    }

    return <Container>
        <Typography sx={{ mt: 1, mb: 1 }} variant="h3">Select Location</Typography>
        <TreeView aria-label="location navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {locations && locations.map(l => mapLocation(l))}
        </TreeView>
    </Container>
};

export default LocationOutlet;