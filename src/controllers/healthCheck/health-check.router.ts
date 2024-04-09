import express, { type Request, type Response } from 'express'

export const healthCheckRouter = express.Router()

healthCheckRouter.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'Hello from the server!' })
})
