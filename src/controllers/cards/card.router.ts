import express from 'express'
import { putUserCardController } from './put-card-info.controller'

export const cardRouter = express.Router()

cardRouter.put('/:userId', putUserCardController)
