import { Menu } from "@headlessui/react";
import { useAuth } from "context/AuthContext";
import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import useSWR from "swr";

import { useProtection } from "utils/hooks/useProtection";

import { ChevronDownIcon } from "@heroicons/react/20/solid"

export interface UserDTO {
  role: string;
  personalEmail: string;
  baylorEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  state: string;
}

const Home: NextPage | any = () => {
  const { logOut, user } = useAuth();
  const [isAuthed] = useProtection();
  const router: NextRouter = useRouter();

  const { data: userData } = useSWR(
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
            <Menu.Button className="p-2 border-2 border-white rounded-md hover:bg-white transition-colors duration-75">
              <div className="inline-block">
                {userData?.firstName}
                <ChevronDownIcon className="w-4 h-4 inline" />
              </div>
            </Menu.Button>
            <Menu.Items>
              <Menu.Item>
                {({ active }) => (
                  <a href="/profile">Profile</a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/"
                    onClick={handleLogout}
                  >
                    Log Out
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
      </nav>
    </>
  )

}

export default Home;