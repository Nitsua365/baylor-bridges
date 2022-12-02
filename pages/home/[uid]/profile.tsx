import NavBar from "components/home/NavBar"
import { useAuth } from "context/AuthContext"
import { GetServerSideProps, NextPage } from "next"
import { getUserById } from "pages/api/users/[uid]"
import { useProtection } from "utils/hooks/useProtection"
import { useForm } from "react-hook-form"
import states from "data/states.json"
import { useMutation } from "react-query"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useFilePicker } from "use-file-picker"

import { Alert, Tooltip, Snackbar, Avatar } from "@mui/material"
import { getDownloadURL, ref, StorageReference, uploadBytes } from "firebase/storage"
import { storage } from "config/firebase"

const Profile: NextPage<HomePageProps> = ({ user, uid }) => {

  const [updateError, setUpdateError] = useState<boolean>(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const [isAuthed]: readonly [boolean] = useProtection(uid)
  const { logOut }: AuthContextType = useAuth()
  const router = useRouter()

  const handleLogout = async (): Promise<void> => await logOut()
  const refreshData = () => router.replace(router.asPath)
  
  const editUserHandle = async (data: any) => {
    Object.entries(data).forEach(([k]) => data[k] = data?.[k] || "")
    await mutateAsync(data)
  }

  const {
    register,
    reset: resetForm,
    formState: { errors: formErrors, isDirty },
    handleSubmit
  } = useForm<EditUserValidation>({ reValidateMode: "onBlur" })

  // react query mutation that handles PUT request for updating user
  const { mutateAsync } = useMutation(async (userData: BodyInit): Promise<Response> => await fetch(`/api/users/${uid}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  }), {
    mutationKey: `/api/users/${uid}`,
    onSuccess: async (data: Response) => {
      const { user } = await data.json()
      resetForm(user)
      refreshData()
      setUpdateError(false)
    },
    onError: () => setUpdateError(true)
  })

  const [openFileSelector, { filesContent, loading: fileLoading, errors: fileErrors }] = useFilePicker({
    accept: "image/*",
    maxFileSize: 5,
    multiple: false,
    readAs: "ArrayBuffer"
  })

  useEffect(() => {
    getDownloadURL(ref(storage, `profileImages/${uid}`))
      .then((url) => setProfileImage(url))
      .catch(() => setProfileImage(null))
  }, [])

  useEffect(() => {

    const refreshProfileImage = async () : Promise<void> => {
      const rootRef: StorageReference = ref(storage, `profileImages/${uid}`)
      await uploadBytes(rootRef, new Blob(Array.of(filesContent[0].content)))
      getDownloadURL(rootRef)
        .then((url) => setProfileImage(url))
    }

    if (filesContent && filesContent.length) {
      refreshProfileImage()
    }
  }, [filesContent])

  // DON'T Move this code
  // prevents a rendering error for the hook form above and validates user below
  if (!isAuthed || !user) {
    return <></>
  }

  const validation: EditUserValidation = {
    personalEmail: { ...register("personalEmail", { value: user.personalEmail || "", required: true }) },
    baylorEmail: {
      ...register("baylorEmail", {
        value: (user.role === "alumni") ? "" : user.baylorEmail,
        disabled: user.role === "alumni",
        validate: (email) => /^.+@baylor.edu$/.test(email), 
        required:  user.role === "student"
      })
    },
    phoneNumber: { ...register("phoneNumber", { value: user.phoneNumber || "", required: true  }) },
    city: { ...register("city", { value: user.city || "", required: true }) },
    state: { ...register("state", { value: user.state || "", required: true }) },
    biography: { ...register("biography", { value: user.biography || "", required: false }) }
  }

  return (
    <>
      <Snackbar
        open={updateError}
        autoHideDuration={6000}
        onClose={() => setUpdateError(false)}
      >
        <Alert severity="error" onClose={() => setUpdateError(false)}>
          Error: Can&apos;t update user information
        </Alert>
      </Snackbar>
      <div className="min-h-screen bg-neutral-200">
        <NavBar
          user={user}
          uid={uid}
          handleLogout={handleLogout}
          enableSearchBar={false} />
        <form onSubmit={handleSubmit(editUserHandle)}>
          <div className="items-center justify-center flex flex-col">
            <div className="rounded-md shadow-xl bg-white max-w-7xl w-5/6 mt-12 mb-8">
              <div className="flex flex-row pl-4 pr-16 pt-4 pb-4">
                <div>
                  <Tooltip title="Click here to upload photo" enterDelay={10} arrow>
                    <Avatar 
                      onClick={() => openFileSelector()} 
                      alt={`${user.firstName} ${user.lastName}`} 
                      src={profileImage || ""} 
                      sx={{ width: 64, height: 64, cursor: "pointer" }} 
                      className="mr-4"
                    >
                      {`${user?.firstName.substring(0, 1)}${user.lastName.substring(0, 1)}`}
                    </Avatar>
                  </Tooltip>
                  {/* {fileErrors && <p className="text-red-500 pb-0 mb-0 text-xs">file error</p>} */}
                </div>
                <div className="flex-initial w-full max-w-xl mr-96">
                  <h1 className="text-2xl font-semibold mt-4">
                    {`${user.firstName} ${user.lastName}`}
                  </h1>
                </div>
                <div className="flex-initial ml-96 mt-1">
                  <button disabled={!isDirty} className="border-2 p-4 disabled:bg-neutral-500 disabled:bg-none bg-gradient-to-r from-primary-500 to-primaryTwo-600 text-white font-medium text-sm leading-tight rounded-md shadow-md hover:bg-primary-500 hover:shadow-lg focus:bg-primary-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primaryTwo-600 active:shadow-lg">
                    SAVE
                  </button>
                </div>
              </div>
            </div>
            <div className="block pl-6 pr-6 pb-6 pt-2 rounded-md shadow-xl bg-white max-w-7xl min-w-fit w-5/6 mb-8">
              <div className="border-solid border-neutral-300 border-b-2 bottom-1 pb-1">
                <h3 className="text-xl mt-4">
                  Profile
                </h3>
              </div>
              <div className="grid grid-cols-2 mt-4 gap-4">
                <div>
                  <p>Email</p>
                  <input
                    {...validation.personalEmail}
                    className="text-lg pl-1 bg-neutral-100 outline-primary-500 rounded-md w-3/4"
                    type="text" 
                  />
                  {formErrors.personalEmail && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Email</p>}
                </div>
                <div>
                  <p>Baylor Email</p>
                  <input {...validation.baylorEmail} className="text-lg pl-1 disabled:bg-slate-300 bg-neutral-100 outline-primary-500 rounded-md w-3/4" type="text" />
                  {formErrors.baylorEmail && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Email</p>}
                </div>
                <div>
                  <p>Phone Number</p>
                  <input {...validation.phoneNumber} className="text-lg pl-1 bg-neutral-100 outline-primary-500 rounded-md w-3/4" type="text" />
                  {formErrors.phoneNumber && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid Phone Number</p>}
                </div>
                <div>
                  <p>Role</p>
                  <p className="text-lg">{`${user.role.substring(0, 1).toUpperCase()}${user.role.substring(1)}`}</p>
                </div>
                <div>
                  <p>City</p>
                  <input {...validation.city} className="text-lg pl-1 bg-neutral-100 outline-primary-500 rounded-md w-3/4" type="text" />
                  {formErrors.city && <p className="text-red-500 pb-0 mb-0 text-xs">Invalid City</p>}
                </div>
                <div>
                  <p>State</p>
                  <select {...validation.state} className="text-lg pl-1 bg-neutral-100 outline-primary-500 rounded-md w-3/4" type="text">
                    {states.map((state: { name: string; abbreviation: string} , idx: number) => <option key={`${state.name}_${idx}`} value={state.abbreviation}>{state.abbreviation}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="block pl-6 pr-6 pb-6 pt-2 rounded-lg shadow-xl bg-white max-w-7xl min-w-fit w-5/6">
              <div className="border-solid border-neutral-300 border-b-2 bottom-1 pb-1">
                <h3 className="text-xl mt-4">
                  Bio
                </h3>
              </div>
              <textarea { ...validation.biography } defaultValue={user.biography} placeholder="Enter Bio" className="pl-1 text-md h-40 bg-neutral-100 mt-3 max-w-5xl w-5/6 outline-primary-400 rounded-l resize-none" />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context: any) => {

  const { uid } = context.params

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)

  return {
    props: {
      user: user || null,
      uid
    }
  }
}

export default Profile