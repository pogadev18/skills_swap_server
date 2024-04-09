dotenv.config() // load env vars

import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { type StrictAuthProp } from '@clerk/clerk-sdk-node'

import { protectRoute } from './middleware/auth'

// routes
import { usersRoute } from './controllers/users/user.router'
import { tagsRouter } from './controllers/tags/tag.router'
import { skillsRouter } from './controllers/skills/skill.router'
import { clerkRouter } from './controllers/webhooks/clerk/clerk.router'
import { healthCheckRouter } from './controllers/healthCheck/health-check.router'

const app = express()
const port = process.env.PORT

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

if (!process.env.PORT) {
  console.error('Error: PORT environment variable is not set.')
  process.exit(1)
}

app.use(cors()) // Enable CORS for all routes
app.use(helmet()) // Set security-related HTTP headers
app.use(morgan('combined')) // Logging HTTP requests

// routes
app.use('/health-check', healthCheckRouter)
app.use('/webhook', clerkRouter)
app.use('/users', protectRoute(), usersRoute)
app.use('/skills', protectRoute(), skillsRouter)
app.use('/tags', protectRoute(), tagsRouter)

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
