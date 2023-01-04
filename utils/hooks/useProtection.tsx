import { useEffect, useState } from "react"
import { useAuth } from "context/AuthContext"

export const useProtection = ({ uid, notAuthed, notUser } : UseProtectionProps) => {

  const { user }: AuthContextType = useAuth()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isUser, setIsUser] = useState<boolean>(false)

  useEffect(() => {
    if (!user || uid !== user.uid) {
      if (notAuthed) notAuthed()
      setIsAuthenticated(false)
    }
    else setIsAuthenticated(true)

    if (uid !== user.uid) {
      if (notUser) notUser()
      setIsUser(false)
    }
    else setIsUser(true)
    
  }, [user])
  
  return [ isAuthenticated, isUser ] as const
}