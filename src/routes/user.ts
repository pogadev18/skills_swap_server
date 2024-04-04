import express from 'express'

import {
  getUserProfile,
  updateUseProfile,
  updateUserSkills
} from '../controllers/userController'

const router = express.Router()

router.get('/:userId', getUserProfile)
router.put('/:userId', updateUseProfile)
router.put('/:userId/skills', updateUserSkills)

export default router
