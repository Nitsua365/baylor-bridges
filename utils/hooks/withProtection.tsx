/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from "context/AuthContext"
import { NextRouter, useRouter } from "next/router"

export function withProtection(Component: any) {
  return function withProtect(props: any) {
    const router: NextRouter = useRouter()
    const { user }: AuthContextType = useAuth()

    if (!user || props.uid !== user.uid) {
      router.replace("/")
      return <></>
    }

    return <Component {...props} />
  }

}