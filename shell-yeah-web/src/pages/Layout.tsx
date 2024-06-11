import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {Link, Outlet} from "react-router-dom";
import StorefrontIcon from '@mui/icons-material/Storefront';
import VideogameAssetOutlinedIcon from '@mui/icons-material/VideogameAssetOutlined';
import {useState} from "react";
import Auth from "../components/Auth.tsx";
import {useSetUser, useUser} from "../context/AuthContext.tsx";
import {useOpenSnackbar} from "../context/SnackbarContext.tsx";
import api from "../../axiosConfig.ts";

const pages = ['news', 'about', 'store', 'play'];


function Layout() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const user = useUser()
    const setUser = useSetUser()
    const openSnackbar = useOpenSnackbar()
    const [openAuthModal, setOpenAuthModal] = useState(false)

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Shell Yeah!
                        </Typography>

                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: 'block', md: 'none'},
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center" component={Link} to={page}>{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <AdbIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: {xs: 'flex', md: 'none'},
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography>
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex', justifyContent: "flex-end"}}}>
                            {/*{pages.map((page) => (*/}
                            {/*    <Button*/}
                            {/*        key={page}*/}
                            {/*        // onClick={handleCloseNavMenu}*/}
                            {/*        variant="outlined"*/}
                            {/*        // variant="contained"*/}
                            {/*        // color="secondary"*/}
                            {/*        sx={{my: 2, color: 'white', display: 'block', borderColor: "white", marginRight: 3}}*/}
                            {/*        component={Link} to={page}*/}
                            {/*    >*/}
                            {/*        {page}*/}
                            {/*    </Button>*/}
                            {/*))}*/}
                            <Button
                                key={"news"}
                                // onClick={handleCloseNavMenu}
                                variant="outlined"
                                // variant="contained"
                                // color="secondary"
                                sx={{my: 2, color: 'white', display: 'block', borderColor: "white", marginRight: 3}}
                                component={Link} to={"news"}
                            >
                                news
                            </Button>
                            <Button
                                key={"about"}
                                // onClick={handleCloseNavMenu}
                                variant="outlined"
                                // variant="contained"
                                // color="secondary"
                                sx={{my: 2, color: 'white', display: 'block', borderColor: "white", marginRight: 3}}
                                component={Link} to={"about"}
                            >
                                about
                            </Button>
                            <Button
                                key={"store"}
                                variant="contained"
                                startIcon={<StorefrontIcon/>}
                                sx={{my: 2, color: 'black', backgroundColor: "white", marginRight: 3}}
                                component={Link} to={"store"}
                            >
                                store
                            </Button>
                            <Button
                                key={"play"}
                                variant="contained"
                                startIcon={<VideogameAssetOutlinedIcon/>}

                                sx={{my: 2, color: 'black', backgroundColor: "white", marginRight: 3}}
                                component={Link} to={"/arena/public"}
                            >
                                play
                            </Button>
                        </Box>
                        {
                            user ?
                                <Box sx={{flexGrow: 0}}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                            <Avatar alt={user.fullName || user.username} src="/static/images/avatar/2.jpg"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{mt: '45px'}}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <MenuItem key={"logout"} onClick={async () => {
                                            try {
                                                const res = await api.post("/user/logout")
                                                setUser(undefined)
                                                handleCloseUserMenu()
                                                openSnackbar(res.data.message)
                                            } catch (e) {
                                                openSnackbar("Logout failed", "error", e?.response?.data?.error || e.message)
                                                return
                                            }
                                        }}>
                                            <Typography textAlign="center">Logout</Typography>
                                        </MenuItem>
                                        {/*{settings.map((setting) => (*/}
                                        {/*    <MenuItem key={setting} onClick={handleCloseUserMenu}>*/}
                                        {/*        <Typography textAlign="center">{setting}</Typography>*/}
                                        {/*    </MenuItem>*/}
                                        {/*))}*/}
                                    </Menu>
                                </Box>
                                :
                                <Button
                                    key={"auth"}
                                    variant="contained"
                                    sx={{my: 2, color: 'black', backgroundColor: "white", marginRight: 3}}
                                    onClick={() => setOpenAuthModal(true)}
                                >
                                    login / register
                                </Button>
                        }

                    </Toolbar>
                </Container>
                <Auth open={openAuthModal} setOpen={setOpenAuthModal}/>
            </AppBar>
            <Outlet/>
        </>
    );
}

export default Layout;