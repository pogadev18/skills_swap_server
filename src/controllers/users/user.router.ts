import express from 'express'

import { getUserController } from './get-user.controller'
import { putUserBiographyController } from './put-user-biography.controller'
import { putUserSkillsController } from './put-user-skills.controller'

export const usersRoute = express.Router()

usersRoute.get('/:userId', getUserController)
usersRoute.put('/:userId', putUserBiographyController)
usersRoute.put('/:userId/skills', putUserSkillsController)
