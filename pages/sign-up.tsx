import type { NextPage } from "next";
import { withPublic } from "../utils/routeProtection";

const SignUp: NextPage = ({ auth } : any) => {
  
  return (
    <>
      <div className="grid h-screen place-items-center rounded overflow-hidden shadow-2xl">
        <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
          <h5 className="text-gray-900 text-xl leading-tight font-medium mb-3">Sign up</h5>
          <div className="mt-2 mb-2">
            <input type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" />
          </div>
          <div className="mt-2 mb-2">
            <input type="password" id="password"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" />
          </div>
          <button type="button" className="mt-2 inline-block px-6 py-2.5 bg-emerald-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-emerald-500 hover:shadow-lg focus:bg-emerald-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-600 active:shadow-lg transition duration-100 ease-in-out">Login</button>
        </div>
      </div>
    </>
  )
}

export default withPublic(SignUp);