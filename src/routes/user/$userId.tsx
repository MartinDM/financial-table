import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/$userId')({
  component: RouteComponent,
})

// get user from params

function RouteComponent() {
  const userId = '$userId' // replace with actual param retrieval logic
  return <div>Hello user, </div>
}
