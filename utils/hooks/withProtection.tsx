/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from "context/AuthContext"
import { NextRouter, useRouter } from "next/router"
import React, { useEffect } from "react"


export function withProtection(Component: any) {
  return function withProtect(props: any) {
    const router: NextRouter = useRouter()
    const auth: AuthContextType = useAuth()

    if (!auth.user || props.uid !== auth.user.uid) {
      router.replace("/")
      return <></>
    }

    return <Component {...props} />
  }

}