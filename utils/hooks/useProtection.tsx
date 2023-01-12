import { useEffect, useState } from "react"
import { useAuth } from "context/AuthContext"
import { NextRouter, useRouter } from "next/router"

export const useProtection = (uid: string) => {

  const { user }: AuthContextType = useAuth()
  const router: NextRouter = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isUser, setIsUser] = useState<boolean>(false)

  useEffect(() => {
    if (!user || uid !== user.uid) {
      router.replace("/")
      setIsAuthenticated(false)
    }
    else setIsAuthenticated(true)
  }, [user])

  // useEffect(() => {
  //   if (user && uid !== user.uid) {
  //     // router.replace("/")
  //     setIsUser(false)
  //   }
  //   else setIsUser(true)
  // }, [user, uid])
  
  return [ isAuthenticated ] as const
}