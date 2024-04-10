import type { Request, Response, NextFunction } from 'express'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import express from 'express'

type MiddlewareOptions = {
  authorizedParties?: string[]
}

export function protectRoute(options?: MiddlewareOptions) {
  const clerkMiddleware = ClerkExpressRequireAuth({
    authorizedParties: options?.authorizedParties || [
      process.env.CLIENT_APP_URL!
    ],
    onError(error) {
      console.error(error)
    }
  })

  return function (req: Request, res: Response, next: NextFunction) {
    // Apply Clerk authentication
    clerkMiddleware(req, res, (authError?: any) => {
      if (authError) {
        // Handle the auth error or forward it
        next(authError)
      } else {
        // If auth is successful, apply express.json() middleware
        express.json()(req, res, next)
      }
    })
  }
}
