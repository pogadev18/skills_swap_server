import express, { type Request, type Response } from 'express'
import type { RequireAuthProp } from '@clerk/clerk-sdk-node'

const router = express.Router()

router.get('/', async (req: RequireAuthProp<Request>, res: Response) => {
  res.json({ message: 'Hello from the server!', auth: req.auth })
})

export default router
