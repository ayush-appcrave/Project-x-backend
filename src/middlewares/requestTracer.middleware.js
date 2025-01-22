const requestTracer = (req, res, next) => {
    const startTime = Date.now()
    const requestId = Math.random().toString(36).substring(7)
    
    // Color codes
    const colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        cyan: '\x1b[36m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m'
    }

    // Request start log
    console.log(
        `${colors.bright}${colors.cyan}[${requestId}]${colors.reset} ` +
        `${colors.yellow}${req.method}${colors.reset} ` +
        `${colors.blue}${req.url}${colors.reset} ` +
        `${colors.magenta}Started${colors.reset}`
    )

    res.on('finish', () => {
        const duration = Date.now() - startTime
        const statusColor = res.statusCode < 400 ? colors.green : '\x1b[31m' // Red for errors

        // Request completion log
        console.log(
            `${colors.bright}${colors.cyan}[${requestId}]${colors.reset} ` +
            `${colors.yellow}${req.method}${colors.reset} ` +
            `${colors.blue}${req.url}${colors.reset} ` +
            `${statusColor}${res.statusCode}${colors.reset} ` +
            `${colors.magenta}${duration}ms${colors.reset}`
        )
    })

    next()
}

export { requestTracer }
