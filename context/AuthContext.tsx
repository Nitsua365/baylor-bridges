/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { auth, db } from "config/firebase"
import { useContext, createContext } from "react"

import {
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut, 
  Unsubscribe,
  UserCredential
} from "firebase/auth"

import { setDoc, doc } from "firebase/firestore"

const AuthContext = createContext<any>({})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // current user data state
  const [user, setUser] = React.useState<MyUserCredential | null>(null)

  // is loading hook
  const [loading, setLoading] = React.useState<boolean>(true)

  // error with login or sign up
  const [error, setError] = React.useState<AuthError | null>(null)

  // login with email and password
  const login = async (email: string, password: string) : Promise<string | null> => { 
    try {
      const { user: userCred }: UserCredential = await signInWithEmailAndPassword(auth, email, password)
      setError({ isError: false, message: null })
      return userCred?.uid || null
    }
    catch (error: any) { 
      setError({ isError: true, message: error.toString() }) 
      throw error
    }
  }

  // signUp with email and password
  const signUp = async (data: UserFormData) : Promise<string | null> => {

    const email: string = (data.role === "student") ? data.baylorEmail : data.personalEmail

    try {

      const { user } : UserCredential = await createUserWithEmailAndPassword(auth, email, data.password)
      
      // get all data except for password
      const { 
        personalEmail,
        baylorEmail,
        phoneNumber,
        firstName, 
        lastName,
        city,
        state,
        role
      } = data

      const insert: UserDTO = {
        biography: "",
        personalEmail: personalEmail || "",
        baylorEmail : baylorEmail || "",
        phoneNumber: phoneNumber || "",
        firstName: firstName || "",
        lastName: lastName || "",
        city: city || "",
        state: state || "",
        role: role || ""
      }


      try {

        // add document to db
        await setDoc(doc(db, "users", user.uid), insert)

        // set the error
        setError({ isError: false, message: null })

        return user.uid
      
      }
      catch(error: any) {
        setError({ isError: true, message: error.toString() }) 
      }

    }
    catch (error: any) { 
      setError({ isError: true, message: error.toString() })  
      throw error
    }

    return null
  }

  // logout with current auth
  const logOut = async () : Promise<void> => {
    await signOut(auth)
    setUser(null)
  }

  const clearError = async () : Promise<void> => setError({ isError: false, message: null })

  // Hook for onAuthStateChange to set or remove the user
  React.useEffect(() => {
    const unSub: Unsubscribe = onAuthStateChanged(auth, userCred => { 
      if (userCred) setUser({ uid: userCred.uid, email: userCred.email, displayName: userCred.displayName })
      else setUser(null)

      setLoading(false)
    })
    return () => unSub()
  }, [])


  return (
    <AuthContext.Provider value={{ user, login, signUp, logOut, error, clearError }}>
      {(loading) ? null : children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): any => useContext(AuthContext)