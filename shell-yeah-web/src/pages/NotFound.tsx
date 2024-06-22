import NotFoundImg from '../assets/404.svg'
import Box from "@mui/material/Box";

function NotFound() {
    return (
        <Box sx={{display: "flex",
            height: "100%",
            flexDirection: "column"
        }}>
            <img style={{margin: "auto", maxHeight: "500px"}} src={NotFoundImg} alt="404 Not Found"/>
        </Box>
        // <h1>404 Not Found</h1>
    )
}

export default NotFound