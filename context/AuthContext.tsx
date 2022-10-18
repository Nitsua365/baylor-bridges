// FirebaseAuthContext.tsx
import * as React from "react";
import { auth } from "../config/firebaseConfig";
import { useContext, createContext } from "react";
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  Unsubscribe
} from "firebase/auth";

interface User {
  uid: string,
  email: string | null,
  displayName: string | null
}

const AuthContext = createContext<any>({});

export const AuthProvider = ({ children } : { children : React.ReactNode }) => {

  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
  const signUp = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
  const logOut = async () => {
    setUser(null);
    await signOut(auth);
  }

  React.useEffect(() => {
    const unSub: Unsubscribe = onAuthStateChanged(auth, user => { 
      if (user) setUser({ uid: user.uid, email: user.email, displayName: user.displayName }) 
      else setUser(null)
      setLoading(false);
    })
    return () => unSub();
  }, [])


  return (
    <AuthContext.Provider value={{user, login, signUp, logOut}}>
      {(loading) ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);