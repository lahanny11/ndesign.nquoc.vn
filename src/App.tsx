import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/config/query-client'
import AppRouter from './routes'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  )
}
