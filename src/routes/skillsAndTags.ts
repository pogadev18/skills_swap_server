import express from 'express'

import { getAllTags } from '../controllers/tagsController'
import { getAllSkills } from '../controllers/skillsController'

const router = express.Router()

router.get('/all-skills', getAllSkills)
router.get('/all-tags', getAllTags)

export default router
