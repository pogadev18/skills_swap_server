import express from 'express'

import { getSkillsController } from './get-skills.controller'

export const skillsRouter = express.Router()

skillsRouter.get('', getSkillsController)
