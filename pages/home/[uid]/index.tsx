import type { NextPage } from "next"

import { useAuth } from "context/AuthContext"
import { useProtection } from "utils/hooks/useProtection"

import { getUserById } from "pages/api/users/[uid]"
import NavBar from "components/home/NavBar"

const Home: NextPage | any = ({ user, uid } : any) => {
    const [isAuthed] : readonly[boolean] = useProtection(uid)
    const { logOut } = useAuth()

    const handleLogout = async () : Promise<void> => await logOut()

    if (!isAuthed) {
        return <></>
    }

    return (
        <>
            <div className="min-h-screen bg-neutral-200">
                <NavBar 
                    user={user}
                    uid={uid} 
                    handleLogout={handleLogout} 
                />
            </div>
        </>
    )

}

export async function getServerSideProps(context : any) {

    const { uid } = context.params

    const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)

    return {
        props: {
            user,
            uid
        }
    }
}

export default Home