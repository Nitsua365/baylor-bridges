import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "context/AuthContext";

export function withPublic(Component: React.FC, pageRedirect: string) {
  return function WithPub(props: any) {
    const auth = useAuth();
    const router = useRouter();

    if (!auth.isError && auth.user) {
      router.replace(pageRedirect)
      return <></>
    }

    return <Component auth={auth} {...props} />
  }
}

export function withProtected(Component: React.FC) {
  return function WithProtected(props: any) {
    const auth = useAuth();
    const router = useRouter();

    if (auth.isError || !auth.user || !auth.userData) {
      router.replace('/login')
      return <></>
    }

    return <Component auth={auth} {...props} />
  }
}