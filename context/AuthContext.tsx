import * as React from "react";
import { auth, db } from "../config/firebase";
import { useContext, createContext } from "react";

import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut, 
  Unsubscribe,
  UserCredential
} from "firebase/auth"

import { setDoc, doc } from "firebase/firestore"

import { UserFormData } from "../pages/sign-up";
import { UserDTO } from "pages/home";

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
    await signInWithEmailAndPassword(auth, email, password)
      .then(({ user } : UserCredential) => { 
        setError({ isError: false, message: null }) 
        setUser({ email: user.email, uid: user.uid, displayName: user.displayName })
      })
      .catch((err : any) => setError({ isError: true, message: err.message }))
  }

  // signUp with email and password
  const signUp = async (data: UserFormData) : Promise<void> => {

    const email: string = (data.role === "student") ? data.baylorEmail : data.personalEmail;

    await createUserWithEmailAndPassword(auth, email, data.password)
      .then(( { user } : UserCredential) => {

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

        const insert: UserDTO = {
          personalEmail: personalEmail || "",
          baylorEmail : baylorEmail || "",
          phoneNumber: phoneNumber || "",
          firstName: firstName || "",
          lastName: lastName || "",
          city: city || "",
          state: state || "",
          role: role || ""
        }

        // add document to db
        setDoc(doc(db, "users", user.uid), insert)
          .then((val) => {
            setError({ isError: false, message: null })
            // set the current user credential
            setUser({ uid: user.uid, email: user.email, displayName: user.displayName });
          })
          .catch((err) => setError({ isError: true, message: err.message }) )

      })
      .catch((err) => setError({ isError: true, message: err.message }))
  }

  // logout with current auth
  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  }

  const clearError = () => setError({ isError: false, message: null })

  // Hook for onAuthStateChange to set or remove the user
  React.useEffect(() => {
    const unSub: Unsubscribe = onAuthStateChanged(auth, userCred => { 
      if (userCred) setUser({ uid: userCred.uid, email: userCred.email, displayName: userCred.displayName })
      else setUser(null)

      setLoading(false);
    })
    return () => unSub();
  }, [])


  return (
    <AuthContext.Provider value={{ user, login, signUp, logOut, error, clearError }}>
      {(loading) ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);