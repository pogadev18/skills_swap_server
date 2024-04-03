import type { WebhookEvent } from '@clerk/clerk-sdk-node'

const handleUserCreated = (eventData: WebhookEvent) => {
  console.log('user created')
}

const handleUserDeleted = (eventData: WebhookEvent) => {
  console.log('user deleted')
}

export { handleUserCreated, handleUserDeleted }
