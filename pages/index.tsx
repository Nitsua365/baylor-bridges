import type { NextPage } from "next"
import Link from "next/link"
import { NextRouter, useRouter } from "next/router"
import { useEffect } from "react"

const Home: NextPage = () => {

  const router: NextRouter = useRouter()

  // protects from user data requests 
  useEffect(() => {
    router.beforePopState(({ as }) => {
      // I only want to allow these two routes!
      if (as !== "/" && as !== "/login" && as !== "/sign-up") {
        // Have SSR render bad routes as a 404.
        window.location.href = as
        return false
      }

      return true
    })
  }, [])

  return (
    <>
      <div className="primary-btn font-semibold text-center w-full flex justify-center px-4 py-5 text-lg rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed relative bg-gradient-to-r from-primary-500 via-primary-600 to-primaryTwo-600 shadow-sm" >
        <Link href="/sign-up">Join the Community</Link>
      </div>
      <div className="primary-btn font-semibold text-center w-full flex justify-center px-4 py-5 text-lg rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed relative bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary-900 shadow-sm">
        <Link href="/login">Sign In</Link>
      </div>
    </>
  )
}

export default Home
