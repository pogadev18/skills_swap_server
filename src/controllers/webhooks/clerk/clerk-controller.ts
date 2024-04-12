import type { Request, Response } from 'express'

import { Webhook } from 'svix'
import type { WebhookEvent } from '@clerk/clerk-sdk-node'
import { createUser, deleteUser } from '../../users/user.dao'

export const listenToWeebhookEventController = async (
  req: Request,
  res: Response
) => {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'WEBHOOK_SECRET is not set' })
  }

  const headers = req.headers
  const payload = req.body

  const svix_id = headers['svix-id'] as string
  const svix_timestamp = headers['svix-timestamp'] as string
  const svix_signature = headers['svix-signature'] as string

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Error occured -- no svix headers' })
  }

  const webhook = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If the verification fails, error out and  return error code

  try {
    // @ts-ignore
    evt = webhook.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    })
  } catch (err: any) {
    console.log('Webhook failed to verify. Error:', err.message)
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }

  // Grab the ID and TYPE of the Webhook
  // const { id } = evt.data
  const eventType = evt.type

  const { data } = evt

  if (!data) {
    console.error('No data in event')
    return
  }

  if (eventType === 'user.created') {
    await createUser(data.id as string)
  }

  if (eventType === 'user.deleted') {
    await deleteUser(data.id as string)
  }

  return res.status(200).json({
    success: true,
    message: 'Webhook received'
  })
}
