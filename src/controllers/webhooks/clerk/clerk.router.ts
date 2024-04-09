import express from 'express'
import bodyParser from 'body-parser'

import { listenToWeebhookEventController } from './clerk-controller'

export const clerkRouter = express.Router()

clerkRouter.post(
  '/clerk',
  bodyParser.raw({ type: 'application/json' }),
  listenToWeebhookEventController
)
