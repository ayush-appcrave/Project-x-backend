const requestTracer = (req, res, next) => {
    const startTime = Date.now()
    const requestId = Math.random().toString(36).substring(7)
    
    console.log(`[${requestId}] ${req.method} ${req.url} - Started`)
    
    res.on('finish', () => {
        const duration = Date.now() - startTime
        console.log(`[${requestId}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`)
    })

    next()
}

export { requestTracer }
