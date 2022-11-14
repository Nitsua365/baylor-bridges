import { NextPage } from "next"
import { getUserById } from "pages/api/users/[uid]";
import { useProtection } from "utils/hooks/useProtection";

const Profile: NextPage = ({ user, uid } : any) => {
  const [isAuthed]: readonly[boolean] = useProtection(uid);

  if (!isAuthed) {
    return <></>
  }

  return (
    <>
      
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