import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'

dotenv.config() // load env vars

// routes
import testRoute from './routes/test'
import clerkWebhookRoute from './routes/clerkWeebhook'
import userRoute from './routes/user'

const app = express()
const port = process.env.PORT

if (!process.env.PORT) {
  console.error('Error: PORT environment variable is not set.')
  process.exit(1)
}

app.use(cors()) // Enable CORS for all routes
app.use(helmet()) // Set security-related HTTP headers
app.use(morgan('combined')) // Logging HTTP requests

/*
- "express.json()" middleware is added individually to each route to
ensure that only routes that require JSON parsing have it enabled.

- the webhook route does not require JSON parsing, so it is not added.

- maybe you can think of a way to refactor this code to avoid repeating.

*/
// routes
app.use('/test', express.json(), testRoute)
app.use('/webhook', clerkWebhookRoute)
app.use('/user', express.json(), userRoute)

// Route not found (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found.' })
})

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Graceful shutdown logic
process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})
