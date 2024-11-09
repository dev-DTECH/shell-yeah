const constants = {
    BASE_URL: "/api/v1",
    SOCKET_BASE_URL: "/",
    ASSETS_URL: "/assets",
}

if (process.env.NODE_ENV !== 'production') {
    constants.BASE_URL = "http://localhost:3000/api/v1"
    constants.SOCKET_BASE_URL = "http://localhost:3000/"
    constants.ASSETS_URL = "http://localhost:3000/assets"
}

export default constants