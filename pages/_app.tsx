import "styles/globals.css"
import type { AppProps } from "next/app"
import { AuthProvider } from "context/AuthContext"
import NextNProgress from "nextjs-progressbar"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NextNProgress color='teal' />
        <Component {...pageProps} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default MyApp
