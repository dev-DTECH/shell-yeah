const contants = {
    BASE_URL: "/api/v1",
    SOCKET_BASE_URL: "/",
}

if (process.env.NODE_ENV !== 'production') {
    contants.BASE_URL = "http://localhost:3000/api/v1"
    contants.SOCKET_BASE_URL = "http://localhost:3000/"
}

export default contants