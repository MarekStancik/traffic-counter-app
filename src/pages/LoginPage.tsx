import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Box, Button, CircularProgress, FormControl, Paper, TextField, Typography } from "@mui/material";
import React, { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import authenticationService from "../services/authentication.service";

const styles = {
    icon: {
        margin: "16px 0px", fontSize: "64px"
    },
    title: {
        marginBottom: "20px", fontSize: "large"
    },
    item: {
        m: 1
    },
    form: {
        padding: "20px",
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
    }
}

interface SubmitButtonProps {
    text: string;
    loadingText: string;
    isLoading: boolean;
    disabled: boolean;
    onSubmit?: (ev: SyntheticEvent) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, loadingText, isLoading, disabled, onSubmit }) => {
    return <FormControl sx={{ width: "75%", m: 1 }}>
        <Button variant="contained" type="submit" disabled={disabled || isLoading}>{isLoading ? loadingText : text}</Button>
        {isLoading && <CircularProgress
            size={24}
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
            }}
        />}
    </FormControl>;
}

const AuthCard: React.FC = () => {

    const [failMessage, setFailMessage] = useState<string>("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();

    const authenticate = (ev: SyntheticEvent) => {
        ev.preventDefault();
        if (username.length > 0 && password.length > 0) {
            setIsAuthenticating(true);
            setFailMessage("");
            authenticationService.authenticate({ username, password }).subscribe({
                error: e => {
                    setIsAuthenticating(false);
                    setFailMessage(e.message);
                },
                next: _ => navigate("/locations")
            });
        }
    }

    return <form onSubmit={authenticate} style={styles.form}>
        <VpnKeyIcon sx={{ ...styles.icon, transform: "rotate(-45deg)", color: failMessage.length > 0 ? "error.main" : "inherit" }} />
        <Box sx={{ ...styles.title, color: failMessage.length > 0 ? "error.main" : "inherit" }}>{failMessage.length > 0 ? failMessage : isAuthenticating ? "Authenticating..." : "Sign in to your account"}</Box>
        <FormControl sx={styles.item} fullWidth>
            <TextField disabled={isAuthenticating} type="text" variant="outlined" label="Username" value={username} onChange={e => setUsername(e.target.value as string)}></TextField>
        </FormControl>

        <FormControl sx={styles.item} fullWidth>
            <TextField disabled={isAuthenticating} type="password" variant="outlined" label="Password" value={password} onChange={e => setPassword(e.target.value as string)}></TextField>
        </FormControl>

        <SubmitButton disabled={username.length === 0 || password.length === 0} isLoading={isAuthenticating} text="Login" loadingText="Authenticating..." />
    </form>;
}


const LoginPage: React.FC = () => {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "inherit",
            width: "100%"
        }}>
            <Box sx={{
                m: 3,
            }}>
                <Typography variant="h4">Traffic Counter 3000</Typography>
                <Paper sx={{
                    flex: "1 1 auto",
                    minWidth: "400px",
                    boxShadow: 1,
                    p: 3,
                    pt: 0,
                    pb: 1,
                    mt: 1,
                    overflow: "auto",
                    maxHeight: "100%"
                }}>
                    <AuthCard/>
                </Paper>

            </Box>
        </Box>
    );
};

export default LoginPage;