import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { useAuth } from "context/AuthContext";

const useProtection = () => {

  const router: NextRouter = useRouter();
  const { user } = useAuth();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    if (!user) {
      router.replace('/login')
      setIsAuthenticated(false)
    }
    else setIsAuthenticated(true)    
  }, [user])
  
  return { isAuthenticated }

}

export default useProtection;
