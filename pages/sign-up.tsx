import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";

import { useForm } from "react-hook-form";

import { useAuth } from '../context/AuthContext'

import { db } from "../config/firebase";


export type UserFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string
}


const SignUp: NextPage = () => {

  // auth hook resources
  const { signUp } = useAuth();

  // page router
  const router: NextRouter = useRouter();

  // user form hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<UserFormData>({ reValidateMode: 'onBlur' });

  const onSubmit = (data: UserFormData) : void => { 
    signUp(data) 
    router.replace('/login');
  }

  return (
    <>
      <div className="grid h-screen place-items-center rounded overflow-hidden shadow-2xl">
        <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
          <h5 className="text-gray-900 text-xl leading-tight font-medium mb-3">
            Sign up
          </h5>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-flow-row">
              <div className="mt-2 mb-2 w-56">
                <input { ...register('email', { required: true })} type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" />
                {errors.email && <p className="text-red-500 pb-0 mb-0 text-xs">invalid email</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...register('password', { required: true }) } type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" />
                {errors.password && <p className="text-red-500 pb-0 mb-0 text-xs">invalid password</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...register('confirmPassword', { 
                    required: true, 
                    validate: () => getValues().password === getValues().confirmPassword 
                  }) 
                } 
                type="password" id="confirm_password" placeholder="Confirm Password" onPaste={() => false} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                {!errors.password && errors.confirmPassword && <p className="text-red-500 pb-0 mb-0 text-xs">password's do not match</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...register('phoneNumber', { required: true })} placeholder="Phone Number" id="phoneNumber" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:blue-500" />
                {errors.phoneNumber && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Phone Number</p>}
              </div>
            </div>
            <button type="submit" className="mt-2 inline-block px-6 py-2.5 bg-emerald-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-emerald-500 hover:shadow-lg focus:bg-emerald-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-600 active:shadow-lg transition duration-100 ease-in-out">Sign Up</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp;