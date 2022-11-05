import { useAuth } from "context/AuthContext";
import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";

import { useEffect, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginValidation {
  email: UseFormRegisterReturn;
  password: UseFormRegisterReturn;
}

const Login: NextPage = () => {

  const { login, error: loginError, clearError: clearAuthErrors } = useAuth();
  const router: NextRouter = useRouter();
  
  const {
    formState: { errors: formErrors },
    register,
    handleSubmit
  } = useForm<LoginForm>({ reValidateMode: 'onBlur' })
  
  const handleLogin = async (data: LoginForm): Promise<void> => {

    // login with email and password
    await login(data.email, data.password);

    if (!loginError?.isError) router.replace('/home')
  }

  const validation: LoginValidation = {
    email: { 
      ...register('email', { 
        required: true, 
        onBlur: () => clearAuthErrors() 
      }) 
    },
    password: { 
        ...register('password', { 
        required: true, 
        onBlur: () => clearAuthErrors() 
      }) 
    }
  }

  return (
    <>
      <div className="grid h-screen place-items-center rounded overflow-hidden shadow-2xl">
        <div className="block p-6 rounded-lg shadow-lg bg-white max-w-lg">
          <h5 className="text-gray-900 text-xl leading-tight font-medium mb-3">Sign in</h5>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="mt-2 mb-2 w-56">
              <input { ...validation.email } type="text" id="login_email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" />
              {formErrors.email && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Email</p>}
            </div>
            <div className="mt-2 mb-2 w-56">
              <input { ...validation.password } type="password" id="login_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" />
              {formErrors.password && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Password</p>}
            </div>
            <div>
            {loginError?.isError && (
              <div className="text-red-500 text-xs">
                {loginError.message}
              </div>
            )}
            </div>
            <button type="submit" className="mt-2 inline-block px-6 py-2.5 bg-emerald-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-emerald-500 hover:shadow-lg focus:bg-emerald-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-600 active:shadow-lg transition duration-100 ease-in-out">Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login;