import type { NextPage } from "next";
import { withProtected } from "../utils/routeProtection";

const Home: NextPage = ({ auth } : any) => {
  const { user, logOut } = auth;

  const handleLogout = async () => await logOut();

  return (
    user && (
      <>
        <div>
          { Object.entries(user).map(([k, v]) => `${k} : ${v}\n`) }
        </div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </>
    )
  )

}

export default withProtected(Home);