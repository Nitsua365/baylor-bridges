import NavBar from "components/home/NavBar";
import { useAuth } from "context/AuthContext";
import { NextPage } from "next"
import { getUserById } from "pages/api/users/[uid]";
import { useProtection } from "utils/hooks/useProtection";
import Avatar from "@mui/material/Avatar";


const Profile: NextPage = ({ user, uid } : any) => {
  const [isAuthed]: readonly[boolean] = useProtection(uid);
  const { logOut } = useAuth();

  const handleLogout = async () : Promise<void> => await logOut();

  if (!isAuthed) {
    return <></>
  }

  return (
    <div className="min-h-screen bg-neutral-200">
      <NavBar 
        user={user} 
        uid={uid} 
        handleLogout={handleLogout} 
      />
      <div className="items-center justify-center flex flex-col">
        <div className="rounded-lg shadow-xl bg-white max-w-7xl min-w-fit w-5/6 mt-8 mb-2">
          <div className="flex flex-row pl-4 pr-16 pt-4 pb-4">
            <Avatar alt={`${user.firstName} ${user.lastName}`} className="mr-4">
              {`${user.firstName.substring(0,1)}${user.lastName.substring(0,1)}`}
            </Avatar>
            <h1 className="text-2xl font-semibold mt-1">
              {`${user.firstName} ${user.lastName}`}
            </h1>
          </div>
        </div>
        <div className="block p-6 rounded-lg shadow-xl bg-white">
          <div>
            Profile
          </div>
        </div>
      </div>
      
    </div>
  )
}

export async function getServerSideProps(context : any) {

  const { uid } = context.params;

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)

  return {
    props: {
      user,
      uid
    }
  }
}

export default Profile;