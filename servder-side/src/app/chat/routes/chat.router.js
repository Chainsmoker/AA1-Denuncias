import express from 'express'
import { chatController } from '../chat.module.js'

const router = express.Router()

router.get('/chat', chatController.chat.bind(chatController))

export default router