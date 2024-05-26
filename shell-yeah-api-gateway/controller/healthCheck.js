const healthCheck = (req, res) => {
    res.json({
        uptime: process.uptime(),
        message: "OK",
        timestamp: Date.now(),
        responseTime: process.hrtime()
    })
}

export default healthCheck