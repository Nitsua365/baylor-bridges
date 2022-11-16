import NavBar from "components/home/NavBar";
import { useAuth } from "context/AuthContext";
import { NextPage } from "next"
import { getUserById } from "pages/api/users/[uid]";
import { useProtection } from "utils/hooks/useProtection";

const Profile: NextPage = ({ user, uid } : any) => {
  const [isAuthed]: readonly[boolean] = useProtection(uid);
  const { logOut } = useAuth();

  const handleLogout = async () : Promise<void> => await logOut();

  if (!isAuthed) {
    return <></>
  }

  return (
    <>
      <NavBar 
        user={user} 
        uid={uid} 
        handleLogout={handleLogout} 
      />
      <div>
        {Object.entries(user).map(([k, v]) => <div key={`${k} : ${v}`}>{`${k} : ${v}`}</div>)}
      </div>
    </>
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