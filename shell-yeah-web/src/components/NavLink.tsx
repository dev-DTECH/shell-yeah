import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

function NavLink({page}: {page: string}) {
    if(page === "store") {}
    return (
        <Button
            key={page}
            variant="outlined"
            // variant="contained"
            // color="secondary"
            sx={{my: 2, color: 'white', display: 'block', borderColor: "white", marginRight: 3}}
            component={Link} to={page}
        >
            {page}
        </Button>
    )
}

export default NavLink