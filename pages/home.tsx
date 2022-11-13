import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import Link from "next/link";
import useSWR, { SWRResponse } from "swr";

import { useAuth } from "context/AuthContext";
import { useProtection } from "utils/hooks/useProtection";

import { Menu } from "@headlessui/react";

import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { forwardRef, Fragment } from "react";

const Home: NextPage | any = () => {
  const { logOut, user } = useAuth();
  const [isAuthed] : readonly[boolean] = useProtection();
  const router: NextRouter = useRouter();

  const { data: userData, error } : SWRResponse = useSWR(
    `/api/users/${user?.uid}`,
    async () => {
      const res = await fetch(`/api/users/${user?.uid}`, { method: "GET" })
      return res.json()
    },
  );

  const handleLogout = async () : Promise<void> => await logOut();

  const MyLink = forwardRef((props: any, ref) => {
    let { href, children, ...rest } = props
    return (
      <Link href={href}>
        <a ref={ref} {...rest}>
          {children}
        </a>
      </Link>
    )
  })

  if (!isAuthed) {
    return <></>
  }

  return (
    <>
      <nav className="flex justify-end text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed relative bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 shadow-sm p-4">
        <Menu as={Fragment}>
          <Menu.Button className="p-2 border-2 border-white rounded-md hover:bg-white hover:text-black transition-colors duration-75">
            {userData?.firstName}
            <ChevronDownIcon className="w-4 h-4 inline" />
          </Menu.Button>
          <Menu.Items as="div" className="grid grid-flow-row absolute top-14 mt-2 w-30 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item as="div" className="grid grid-flow-row shadow-2xl">
              {({ active }) => (
                <MyLink href="/profile" className={`${(active) ? 'bg-teal-600 text-white' : 'bg-teal-50 text-black' } rounded-md pt-2 pb-2 pl-4 pr-4 transition-colors duration-150`}>
                  Profile
                </MyLink>
              )}
            </Menu.Item>
            <Menu.Item as={Fragment}>
              {({ active }) => (
                <MyLink
                  className={`${(active) ? 'bg-teal-600 text-white' : 'bg-teal-50 text-black' } rounded-md pt-2 pb-2 pl-4 pr-4 transition-colors duration-150`}
                  onClick={handleLogout}
                  href="/login"
                >
                  Log Out
                </MyLink>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </nav>
    </>
  )

}

export default Home;