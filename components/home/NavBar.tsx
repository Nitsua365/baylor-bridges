import React, { Fragment, forwardRef } from "react"

import Link from "next/link"

import { ChevronDownIcon } from "@heroicons/react/20/solid"
import SearchIcon from "@mui/icons-material/Search"

import { Menu } from "@headlessui/react"
import Image from "next/image"
import BULogo from "assets/BU.png"

type NavBarProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any,
  uid: string,
  handleLogout: () => Promise<void>,
  enableSearchBar: boolean
}

const NavBar: React.FC<NavBarProps> = ({ user, uid, handleLogout, enableSearchBar=false }) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MyLink = forwardRef((props: any, ref) => {
    const { href, children, ...rest } = props
    return (
      <Link href={href}>
        <a ref={ref} {...rest}>
          {children}
        </a>
      </Link>
    )
  })
  MyLink.displayName = "MyLink"

  return (
    <>
      <nav className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed relative bg-gradient-to-r from-primary-500 via-primary-600 to-primaryTwo-600 shadow-sm p-4">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <div className="flex">
            <div className="flex-1">
              <Image width={48} height={48} src={BULogo} alt="Not Found" />
            </div>
            {enableSearchBar && (
              <div className="flex-1 inline-flex ml-16 mt-1 max-w-xl">
                <input className="h-10 text-neutral-600 text-2xl rounded-md outline-4 focus:outline-primary-400 w-96" placeholder="Search Alumni" />
                <button className="border-2 rounded-md mb-2">
                  <SearchIcon fontSize="large" />
                </button>
              </div>
            )}
          </div>
          <div>
            <Menu as={Fragment}>
              <Menu.Button className="p-2 border-2 border-white rounded-md hover:bg-white hover:text-black transition-colors duration-75">
                {user?.firstName}
                <ChevronDownIcon className="w-4 h-4 inline" />
              </Menu.Button>
              <Menu.Items as="div" className="grid grid-flow-row absolute top-14 mt-2 w-30 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item as="div" className="grid grid-flow-row shadow-2xl">
                  {({ active }) => (
                    <MyLink
                      href={`/home/${uid}/profile`}
                      className={`${(active) ? "bg-primaryTwo-600 text-white" : "bg-primaryTwo-50 text-black"} rounded-md pt-2 pb-2 pl-4 pr-4 transition-colors duration-150`}>
                      Profile
                    </MyLink>
                  )}
                </Menu.Item>
                <Menu.Item as={Fragment}>
                  {({ active }) => (
                    <MyLink
                      className={`${(active) ? "bg-primaryTwo-600 text-white" : "bg-primaryTwo-50 text-black"} rounded-md pt-2 pb-2 pl-4 pr-4 transition-colors duration-150`}
                      onClick={handleLogout}
                      href="/"
                    >
                      Log Out
                    </MyLink>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavBar