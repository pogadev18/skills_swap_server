import express from 'express'

import { getTagsController } from './get-tags.controller'

export const tagsRouter = express.Router()

tagsRouter.get('', getTagsController)
