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

import { UserFormData } from "pages/sign-up";

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

// User Data Transfer Object
export interface UserDTO {
  role: string;
  personalEmail: string;
  baylorEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  state: string;
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
    try {
      const { user: userCred }: UserCredential = await signInWithEmailAndPassword(auth, email, password)
      setError({ isError: false, message: null })
      setUser({ email: userCred.email, uid: userCred.uid, displayName: userCred.displayName })
    }
    catch (error: any) { 
      setError({ isError: true, message: error.toString() }) 
      throw error
    }
  }

  // signUp with email and password
  const signUp = async (data: UserFormData) : Promise<void> => {

    const email: string = (data.role === "student") ? data.baylorEmail : data.personalEmail;

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


      try {

        // add document to db
        await setDoc(doc(db, "users", user.uid), insert)

        // set the error
        setError({ isError: false, message: null })

        // set the current user credential
        setUser({ uid: user.uid, email: user.email, displayName: user.displayName })
      
      }
      catch(error: any) { 
        setError({ isError: true, message: error.toString() }) 
      }

    }
    catch (error: any) { 
      setError({ isError: true, message: error.toString() })  
      throw error;
    }

  }

  // logout with current auth
  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  }

  const clearError = async () => setError({ isError: false, message: null })

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