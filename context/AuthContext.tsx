import * as React from "react";
import { auth, db } from "../config/firebase";
import { useContext, createContext } from "react";

import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut, 
  Unsubscribe
} from "firebase/auth"

import { collection, addDoc } from "firebase/firestore"

import { UserFormData } from "../pages/sign-up";

// interface user data
interface User {
  uid: string,
  email: string | null,
  displayName: string | null
}

// interface for Error message
interface Error {
  isError: boolean,
  message: string | null
}

const AuthContext = createContext<any>({});

export const AuthProvider = ({ children } : { children : React.ReactNode }) => {

  // current user data state
  const [user, setUser] = React.useState<User | null>(null);

  // is loading hook
  const [loading, setLoading] = React.useState<boolean>(true);

  // error with login or sign up
  const [error, setError] = React.useState<Error | null>(null);

  // login with email and password
  const login = async (email: string, password: string) : Promise<void> => { 
    signInWithEmailAndPassword(auth, email, password)
      .then((val) => setError({ isError: false, message: null }))
      .catch((err) => setError({ isError: true, message: err.message }))
  }

  // signUp with email and password
  const signUp = async (data: UserFormData) : Promise<void> => { 
    createUserWithEmailAndPassword(auth, data.personalEmail, data.password)
      .then(async (user) => {

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
            } = data;

        // add Document to the database
        await addDoc(collection(db, "users"), {
          personalEmail,
          baylorEmail,
          phoneNumber,
          firstName,
          lastName,
          city,
          state,
          role,
          uid: user.user.uid
        })

        // set the error state
        setError({ isError: false, message: null })

      })
      .catch((err) => setError({ isError: true, message: err.message }))
  }

  // logout with current auth
  const logOut = async () => {
    setUser(null);
    await signOut(auth);
  }


  // Hook for onAuthStateChange to set or remove the user
  React.useEffect(() => {
    const unSub: Unsubscribe = onAuthStateChanged(auth, user => { 
      if (user) setUser({ uid: user.uid, email: user.email, displayName: user.displayName }) 
      else setUser(null)
      setLoading(false);
    })
    return () => unSub();
  }, [])


  return (
    <AuthContext.Provider value={{ user, login, signUp, logOut, error }}>
      {(loading) ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);