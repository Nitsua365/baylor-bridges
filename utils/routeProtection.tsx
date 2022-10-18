import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../context/AuthContext";

export function withPublic(Component: React.FC) {
  return function WithPub(props: any) {
    const auth = useAuth();
    const router = useRouter();

    if (auth.user) {
      router.replace('/home')
      return <></>
    }

    return <Component auth={auth} {...props} />
  }
}

export function withProtected(Component: React.FC) {
  return function WithProtected(props: any) {
    const auth = useAuth();
    const router = useRouter();

    if (!auth.user) {
      router.replace('/login')
      return <></>
    }

    return <Component auth={auth} {...props} />
  }
}