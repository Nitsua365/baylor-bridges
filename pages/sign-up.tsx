import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";

import { useState } from "react";

import { useForm, UseFormRegisterReturn } from "react-hook-form";

import { useAuth } from "../context/AuthContext"

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

// user form data type
export type UserFormData = {
  role: UserRoles;
  personalEmail: string;
  baylorEmail: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  city: string;
  state: string;
}

type UserValidationType = {
  role: UserRoles;
  personalEmail: UseFormRegisterReturn;
  baylorEmail: UseFormRegisterReturn;
  firstName: UseFormRegisterReturn;
  lastName: UseFormRegisterReturn;
  password: UseFormRegisterReturn;
  confirmPassword: UseFormRegisterReturn;
  phoneNumber: UseFormRegisterReturn;
  city: UseFormRegisterReturn;
  state: UseFormRegisterReturn;
}

type UserRoles = "student" | "alumni";

const SignUp: NextPage = () => {

  // auth hook resources
  const { signUp, error : authError } = useAuth();

  // page router
  const router: NextRouter = useRouter();

  // state variables
  const [roleToggle, setRoleToggle] = useState<UserRoles>("student");

  // user form hook
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues
  } = useForm<UserFormData>({ reValidateMode: 'onBlur' });

  // on submit handler to create a new user
  const onSubmit = (data: UserFormData) : void => { 
    signUp(data);
    if (!authError?.isError)
      router.replace('/login');
  }

  // validation and registration for react hook forms
  const validation: UserValidationType = {
    role: roleToggle,
    baylorEmail: { ...register('baylorEmail', { required: true, disabled: roleToggle === "alumni" }) },
    personalEmail: { ...register('personalEmail', { required: true }) },
    firstName: { ...register('firstName', { required: true }) },
    lastName: { ...register('lastName', { required: true }) },
    password: { ...register('password', { required: true }) },
    confirmPassword: {
      ...register('confirmPassword', { 
        required: true, 
        validate: () => getValues().password === getValues().confirmPassword 
      })
    },
    phoneNumber: { ...register('phoneNumber', { required: true }) },
    city: { ...register('city', { required: true }) },
    state: { ...register('state', { required: true }) }
  }

  return (
    <>
      <div className="grid h-screen place-items-center rounded overflow-hidden shadow-2xl">
        <div className="block p-6 rounded-lg shadow-lg bg-white max-w-lg">
          <h5 className="text-gray-900 text-xl leading-tight font-medium mb-3">
            Sign up
          </h5>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 grid grid-flow-col" role="group">
              <div>
                <h1 className="mr-4 pt-2">Are you:</h1>
              </div>
              <div>
                <ToggleButtonGroup
                  size="small"
                  color="success"
                  value={roleToggle}
                  exclusive
                  onChange={(e, newAlignment: UserRoles) => setRoleToggle(newAlignment) }
                  aria-label="Platform"
                >
                  <ToggleButton value="student">Student</ToggleButton>
                  <ToggleButton value="alumni">Alumni</ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
            <div className="grid grid-flow-row">
              <div className="mt-1 mb-2 w-56">
                <input { ...validation.personalEmail } placeholder="Personal Email" type="text" id="personalEmail" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                {formErrors.personalEmail && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Email</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...validation.baylorEmail } placeholder="Baylor Email" type="text" id="baylorEmail" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                {formErrors.baylorEmail && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Email</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...validation.firstName } placeholder="First Name" type="text" id="firstName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                {formErrors.firstName && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid First Name</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...validation.lastName } placeholder="Last Name" type="text" id="lastName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                {formErrors.lastName && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Last Name</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...validation.phoneNumber } placeholder="Phone Number" id="phoneNumber" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:blue-500" />
                {formErrors.phoneNumber && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Phone Number</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...validation.city } placeholder="City" id="city" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:blue-500" />
                {formErrors.phoneNumber && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid City</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...validation.state } placeholder="State" id="state" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:blue-500" />
                {formErrors.phoneNumber && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid State</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...validation.password } placeholder="Password" type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                {formErrors.password && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Password</p>}
              </div>
              <div className="mt-1 mb-2 w-56">
                <input { ...validation.confirmPassword } type="password" id="confirm_password" placeholder="Confirm Password" onPaste={() => false} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                {!formErrors.password && formErrors.confirmPassword && <p className="text-red-500 pb-0 mb-0 text-xs">Password's do not match</p>}
              </div>
            </div>
            <button type="submit" className="mt-2 inline-block px-6 py-2.5 bg-emerald-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-emerald-500 hover:shadow-lg focus:bg-emerald-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-600 active:shadow-lg transition duration-100 ease-in-out">Sign Up</button>
            <div>
              {authError?.isError && <p className="text-red-500 pb-0 mb-0 text-xs">{authError.message}</p>}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp;