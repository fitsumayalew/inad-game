import { createFileRoute } from '@tanstack/react-router'
import SpinGame from '../pages/SpinGame'

export const Route = createFileRoute('/spin_game')({
  component: SpinGame,
}) 