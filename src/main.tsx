import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
  createRouter,
} from '@tanstack/react-router'

import './index.css'

import { routeTree } from './routeTree.gen'

// Create the router instance from generated route tree
const router = createRouter({ routeTree })

// Optional: Type augmentation for router instance
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
