import type { NextPage } from "next";
import { withProtected } from "utils/routeProtection";

const Home: NextPage = ({ auth } : any) => {
  const { user, userData, logOut } = auth;

  const handleLogout = async () => await logOut();

  return (
    user && (
      <>
        <div>
          { Object.entries(userData).map(([k, v]) => <div>{`${k} : ${v}\n`}</div>) }
        </div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </>
    )
  )

}

export default withProtected(Home);