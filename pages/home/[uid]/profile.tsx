import NavBar from "components/home/NavBar"
import { useAuth } from "context/AuthContext"
import { GetServerSideProps, NextPage } from "next"
import { getUserById } from "pages/api/users/[uid]"
import { useProtection } from "utils/hooks/useProtection"
import Avatar from "@mui/material/Avatar"
import { useForm } from "react-hook-form"
import states from "data/states.json"
import { useEffect } from "react"

const Profile: NextPage<HomePageProps> = ({ user, uid }) => {
  const [isAuthed]: readonly[boolean] = useProtection(uid)
  const { logOut }: AuthContextType = useAuth()

  const handleLogout = async () : Promise<void> => await logOut()

  const {
    register,
    getValues,
    reset: resetForm,
    formState : { errors: formErrors, isDirty, isSubmitSuccessful },
    handleSubmit
  } = useForm<EditUserValidation>({ reValidateMode: "onBlur" })

  useEffect(() => {
    if (isSubmitSuccessful) resetForm()
  }, [isSubmitSuccessful, resetForm])

  const editUserHandle = () => {

  }

  // DON'T Move this code
  // prevents a rendering error for the hook form above and validates user below
  if (!isAuthed || !user) {
    return <></>
  }

  const validation: EditUserValidation = {
    personalEmail: { ...register("personalEmail", { value: user.personalEmail }) },
    baylorEmail: {
      ...register("baylorEmail", {
        value: user.baylorEmail, 
        disabled: user.role === "alumni", 
        validate: (email) => /^.+@baylor.edu$/.test(email) 
      }) 
    },
    phoneNumber: { ...register("phoneNumber", { value: user.phoneNumber }) },
    city: { ...register("city", { value: user.city }) },
    state: { ...register("state", { value: user.state }) },
    biography: { ...register("biography", { value: user.biography }) }
  }

  return (
    <div className="min-h-screen bg-neutral-200">
      <NavBar 
        user={user} 
        uid={uid} 
        handleLogout={handleLogout}
        enableSearchBar={false}
      />
      <form onSubmit={handleSubmit()}>
        <div className="items-center justify-center flex flex-col">
          <div className="rounded-md shadow-xl bg-white max-w-7xl min-w-fit w-5/6 mt-12 mb-8">
            <div className="flex flex-row pl-4 pr-16 pt-4 pb-4">
              <div>
                <Avatar alt={`${user.firstName} ${user.lastName}`} sx={{ width: 64, height: 64 }} className="mr-4">
                  {`${user?.firstName.substring(0,1)}${user.lastName.substring(0,1)}`}
                </Avatar>
              </div>
              <div>
                <h1 className="text-2xl font-semibold mt-4">
                  {`${user.firstName} ${user.lastName}`}
                </h1>
              </div>
              <div>
                {isDirty && (
                  <button className="border-2 bg-primary-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-primary-500 hover:shadow-lg focus:bg-primary-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primaryTwo-600 active:shadow-lg transition duration-100 ease-in-out">
                  Save
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="block pl-6 pr-6 pb-6 pt-2 rounded-md shadow-xl bg-white max-w-7xl min-w-fit w-5/6 mb-8">
            <div className="border-solid border-neutral-300 border-b-2 bottom-1 pb-1">
              <h3 className="text-xl mt-4">
              Profile
              </h3>
            </div>
            <div className="grid grid-cols-2 mt-4 gap-4">
              <div>
                <p>Email</p>
                <input 
                  { ...validation.personalEmail } 
                  className="text-lg pl-1 bg-neutral-100 outline-primary-500 rounded-md w-3/4" 
                  type="text" 
                />
              </div>
              <div>
                <p>Baylor Email</p>
                <input { ...validation.baylorEmail } className="text-lg pl-1 disabled:bg-slate-300 bg-neutral-100 outline-primary-500 rounded-md w-3/4" type="text" />
              </div>
              <div>
                <p>Phone Number</p>
                <input { ...validation.phoneNumber } className="text-lg pl-1 bg-neutral-100 outline-primary-500 rounded-md w-3/4" type="text" />
              </div>
              <div>
                <p>Role</p>
                <p className="text-lg">{`${user.role.substring(0,1).toUpperCase()}${user.role.substring(1)}`}</p>
              </div>
              <div>
                <p>City</p>
                <input { ...validation.city } className="text-lg pl-1 bg-neutral-100 outline-primary-500 rounded-md w-3/4" type="text" />
              </div>
              <div>
                <p>State</p>
                <select { ...validation.state } className="text-lg pl-1 bg-neutral-100 outline-primary-500 rounded-md w-3/4" type="text">
                  {states.map((state: { name: string, abbreviation: string }, idx: number) => <option key={`${state.name}_${idx}`} value={state.abbreviation}>{state.abbreviation}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="block pl-6 pr-6 pb-6 pt-2 rounded-lg shadow-xl bg-white max-w-7xl min-w-fit w-5/6">
            <div className="border-solid border-neutral-300 border-b-2 bottom-1 pb-1"> 
              <h3 className="text-xl mt-4">
              Bio
              </h3>
            </div>
            <textarea defaultValue={user.biography} placeholder="Enter Bio" className="pl-1 text-md h-40 bg-neutral-100 mt-3 max-w-5xl w-5/6 outline-primary-400 rounded-l resize-none" />
          </div>
        </div>
      </form>
    </div>
  )
}

export const getServerSideProps : GetServerSideProps<HomePageProps> = async (context : any) => {

  const { uid } = context.params

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)

  return {
    props: {
      user: user || null,
      uid
    }
  }
}

export default Profile