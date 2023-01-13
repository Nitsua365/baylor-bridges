import "styles/globals.css"
import type { AppProps } from "next/app"
import { AuthProvider } from "context/AuthContext"
import { QueryClient, QueryClientProvider } from "react-query"
import dynamic from "next/dynamic"

const queryClient = new QueryClient()
const DynamicProgressBar = dynamic(() => import("nextjs-progressbar"))

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DynamicProgressBar color="teal" />
        <Component {...pageProps} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default MyApp
