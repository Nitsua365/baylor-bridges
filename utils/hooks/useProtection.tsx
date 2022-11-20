import { useEffect, useState } from "react"
import { NextRouter, useRouter } from "next/router"
import { useAuth } from "context/AuthContext"

export const useProtection = (uid: string) => {

  const router: NextRouter = useRouter()
  const { user }: AuthContextType = useAuth()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    if (!user || uid !== user.uid) {
      router.replace("/")
      setIsAuthenticated(false)
    }
    else setIsAuthenticated(true)
  }, [user])
  
  return [ isAuthenticated ] as const
}