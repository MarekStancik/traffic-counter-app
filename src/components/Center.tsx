import {Box} from "@mui/system";

const Center: React.FC = props => {
    return (
        <Box 
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {props.children}
        </Box>
    );
};

export default Center
