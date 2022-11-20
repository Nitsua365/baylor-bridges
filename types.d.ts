
// For Next Pages under home directory
declare type HomePageProps = {
  user: FirebaseFirestore.DocumentData | null, 
  uid: string
}

// User Validation Types

// Auth User Credential
declare type MyUserCredential = {
  uid: string,
  email: string | null,
  displayName: string | null
}

// interface for Auth Error message
declare interface AuthError {
  isError: boolean,
  message: string | null
}

declare type AuthContextType = { 
  user: MyUserCredential, 
  login: (email: string, password: string) => Promise<string | undefined>, 
  signUp: (data: UserFormData) => Promise<string | null>, 
  logOut: () => Promise<void>, 
  error: AuthError, 
  clearError: () => Promise<void> 
}

// User Data Transfer Object should contain entire schema for User in Firestore
declare interface UserDTO {
  role: string;
  personalEmail: string;
  baylorEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  state: string;
  biography: string;
}

// Sign-up Form 
declare type UserFormData = {
  role: UserRoles;
  personalEmail: string;
  baylorEmail: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  city: string;
  state: string;
}

declare type UserValidationType = {
  personalEmail: UseFormRegisterReturn;
  baylorEmail: UseFormRegisterReturn;
  firstName: UseFormRegisterReturn;
  lastName: UseFormRegisterReturn;
  password: UseFormRegisterReturn;
  confirmPassword: UseFormRegisterReturn;
  phoneNumber: UseFormRegisterReturn;
  city: UseFormRegisterReturn;
  state: UseFormRegisterReturn;
}

declare type UserRoles = "student" | "alumni";

// Edit User
declare type EditUserValidation = {
  personalEmail: UseFormRegisterReturn,
  baylorEmail: UseFormRegisterReturn,
  phoneNumber: UseFormRegisterReturn,
  city: UseFormRegisterReturn,
  state: UseFormRegisterReturn,
  biography: UseFormRegisterReturn
}

declare type EditUserDTO = {
  personalEmail: string,
  baylorEmail: string,
  phoneNumber: string,
  city: string,
  state: string,
  biography: string
}

// login validation
declare interface LoginForm {
  email: string;
  password: string;
}

declare interface LoginValidation {
  email: UseFormRegisterReturn;
  password: UseFormRegisterReturn;
}

// NavBar Props
declare type NavBarProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any,
  uid: string,
  handleLogout: () => Promise<void>,
  enableSearchBar: boolean
}