import NavBar from "components/home/NavBar"
import { useAuth } from "context/AuthContext"
import { GetServerSideProps, NextPage } from "next"
import { getUserById } from "pages/api/users/[uid]"
import { useProtection } from "utils/hooks/useProtection"
import Avatar from "@mui/material/Avatar"
import { useForm } from "react-hook-form"


const Profile: NextPage<{ user: FirebaseFirestore.DocumentData | undefined, uid: string }> = ({ user, uid }) => {
  const [isAuthed]: readonly[boolean] = useProtection(uid)
  const { logOut } = useAuth()

  if (!isAuthed || !user) {
    return <></>
  }

  const handleLogout = async () : Promise<void> => await logOut()

  const {
    register
  } = useForm({ reValidateMode: "onBlur" })

  const validation = {
    personalEmail: { ...register("personalEmail", { value: user.personalEmail }) },
    baylorEmail: { ...register("baylorEmail", { value: user.baylorEmail, disabled: user.role === "alumni" }) },
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
      />
      <div className="items-center justify-center flex flex-col">
        <div className="rounded-md shadow-xl bg-white max-w-7xl min-w-fit w-5/6 mt-12 mb-8">
          <div className="flex flex-row pl-4 pr-16 pt-4 pb-4">
            <Avatar alt={`${user.firstName} ${user.lastName}`} sx={{ width: 64, height: 64 }} className="mr-4">
              {`${user?.firstName.substring(0,1)}${user.lastName.substring(0,1)}`}
            </Avatar>
            <h1 className="text-2xl font-semibold mt-4">
              {`${user.firstName} ${user.lastName}`}
            </h1>
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
              <input { ...validation.state } className="text-lg pl-1 bg-neutral-100 outline-primary-500 rounded-md w-3/4" type="text" />
            </div>
          </div>
        </div>
        <div className="block pl-6 pr-6 pb-6 pt-2 rounded-lg shadow-xl bg-white max-w-7xl min-w-fit w-5/6">
          <div className="border-solid border-neutral-300 border-b-2 bottom-1 pb-1"> 
            <h3 className="text-xl mt-4">
              Bio
            </h3>
          </div>
          <textarea placeholder="Enter Bio" className="pl-1 text-md h-40 bg-neutral-100 mt-3 max-w-5xl w-5/6 outline-primary-400 rounded-l resize-none">
            {user.biography}
          </textarea>
        </div>
      </div>
      
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps : GetServerSideProps = async (context : any) => {

  const { uid } = context.params

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)

  return {
    props: {
      user,
      uid
    }
  }
}

export default Profile