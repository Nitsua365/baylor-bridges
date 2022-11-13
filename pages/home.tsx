import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import Link from "next/link";
import useSWR, { SWRResponse } from "swr";

import { useAuth, UserDTO } from "context/AuthContext";
import { useProtection } from "utils/hooks/useProtection";

import { Menu } from "@headlessui/react";

import { ChevronDownIcon } from "@heroicons/react/20/solid"

const Home: NextPage | any = () => {
  const { logOut, user } = useAuth();
  const [isAuthed] = useProtection();
  const router: NextRouter = useRouter();

  const { data: userData } : SWRResponse = useSWR(
    `/api/users/${user?.uid}`,
    async () => {
      const res = await fetch(`/api/users/${user?.uid}`, { method: "GET" })
      return res.json()
    }
  );

  const handleLogout = async () => {
    await logOut();
    router.replace('/')
  }

  if (!isAuthed) {
    return <></>
  }

  return (
    <>
      <nav className="flex justify-end items-center flex-wrap text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed relative bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 shadow-sm p-4">
        <Menu>
          <Menu.Button className="p-2 border-2 border-white rounded-md hover:bg-white hover:text-black transition-colors duration-75">
            <div className="inline-block">
              {userData?.firstName}
              <ChevronDownIcon className="w-4 h-4 inline" />
            </div>
          </Menu.Button>
          <Menu.Items className="absolute top-14 mt-2 w-30 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="grid grid-flow-col px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <div className={`${(active) ? 'bg-teal-900' : 'bg-teal-50' } text-black`}>
                    <Link href="/profile">Profile</Link>
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div className={`${(active) ? 'bg-teal-900' : 'bg-teal-50' } text-black`}>
                    <Link
                      href="/"
                      onClick={handleLogout}
                    >
                      Log Out
                    </Link>
                  </div>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </nav>
    </>
  )

}

export default Home;