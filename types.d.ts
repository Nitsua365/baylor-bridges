// For Next Pages under home directory
declare type HomePageProps = {
  user: FirebaseFirestore.DocumentData | UserDTO | null,
  alumni: Array
  uid: string
}

declare type SearchPageProps = {
  user: FirebaseFirestore.DocumentData | UserDTO | null,
  alumni: Array
  uid: string
}

declare type ProfilePageProps = {
  user: FirebaseFirestore.DocumentData | UserDTO | null,
  uid: string
}

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
  uid?: string;
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
  phoneNumber: UseFormRegisterReturn,
  city: UseFormRegisterReturn,
  state: UseFormRegisterReturn,
  biography: UseFormRegisterReturn
}

declare type EditUserDTO = {
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
  queryRef?: React.MutableRefObject,
  user: any,
  uid: string,
  handleLogout: () => Promise<void>,
  handleSearch: (q: string) => void,
  enableSearchBar: boolean,
}

// UserCard Props
declare type UserCardProps = {
  user: UserDTO,
  profileImageUrl: string | null
}

// Profile SnackBar Error
declare type SnackBarError = {
  isError: boolean,
  isSuccess: boolean,
  msg: string | null
}

// GET /users/[uid] types
declare type UsersServiceParams = { 
  start: number,
  limit: number,
  orderBy?: string,
  roleFilter?: UserRoles,
  filters?: string,
  q: string
}

// Search Query Home Page
declare type SearchQueryHomePage = {
  q?: string
  filters?: string
  orderBy?: string
}

declare type FilterableAttributes = "city" | "state" | "role"

declare type UseProtectionProps = { 
  uid: string, 
  notAuthed?: () => void, 
  notUser?: () => void 
}