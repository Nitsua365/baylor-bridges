import NavBar from "components/home/NavBar"
import { useAuth } from "context/AuthContext"
import { GetServerSideProps, NextPage } from "next"
import { getUserById } from "pages/api/users/[uid]"
import { useProtection } from "utils/hooks/useProtection"
import { useForm } from "react-hook-form"
import states from "data/states.json"
import { useMutation } from "react-query"
import { NextRouter, useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useFilePicker } from "use-file-picker"

import { Alert, Tooltip, Snackbar, Avatar } from "@mui/material"
import { getDownloadURL, ref, StorageReference, uploadBytes } from "firebase/storage"
import { storage } from "config/firebase"

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"

const Profile: NextPage<ProfilePageProps> = ({ user, uid }) => {

  const [snackBarMsg, setSnackBarMsg] = useState<SnackBarError>({ isError: false, isSuccess: false, msg: null })

  const [profileImage, setProfileImage] = useState<string | null>(null)

  const [biographyLength, setBiographyLength] = useState<number>(user?.biography.length)

  const [isAuthed, isUser]: readonly[boolean, boolean] = useProtection({ uid })
  const { logOut }: AuthContextType = useAuth()
  const router: NextRouter = useRouter()

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
  const { mutateAsync } = useMutation(
    async (userData: BodyInit): Promise<Response> => await fetch(`/api/users/${uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    }), {
      mutationKey: `/api/users/${uid}`,
      onSuccess: async (data: Response) => {
        const { user } = await data.json()
        resetForm(user)
        refreshData()
        setSnackBarMsg({ isError: false, isSuccess: true, msg: "User Profile Updated" })
      },
      onError: () => setSnackBarMsg({ isError: true, isSuccess: false, msg: "Can't update profile information" })
    })

  const [openFileSelector, { filesContent, loading: fileLoading, errors: fileErrors }] = useFilePicker({
    accept: "image/*",
    maxFileSize: 1,
    multiple: false,
    readAs: "ArrayBuffer"
  })

  // Sets the profile pic on page load
  useEffect(() => {
    getDownloadURL(ref(storage, `profileImages/${uid}`))
      .then((url) => setProfileImage(url))
      .catch(() => ({}))
  }, [])

  // Sets the profile pic on upload of new pic
  useEffect(() => {
    const refreshProfileImage = async () : Promise<void> => {
      const rootRef: StorageReference = ref(storage, `profileImages/${uid}`)
      await uploadBytes(rootRef, new Blob(Array.of(filesContent[0].content)))
      getDownloadURL(rootRef)
        .then((url) => { 
          setProfileImage(url)
          setSnackBarMsg({ isError: false, isSuccess: true, msg: "Updated Profile Image" })
        })
        .catch(() => setSnackBarMsg({ isError: true, isSuccess: false, msg: "Can't fetch profile image"}))
    }

    if (!fileLoading && filesContent && filesContent.length) refreshProfileImage()
    else if (fileErrors[0]) setSnackBarMsg({ isError: true, isSuccess: false, msg: "File Upload Error" })
  }, [filesContent, fileLoading, fileErrors])

  // DON'T Move this code
  // prevents a rendering error for the hook form above and validates user below
  if (!isAuthed || !user) {
    return <></>
  }

  const validation: EditUserValidation = {
    phoneNumber: { ...register("phoneNumber", { 
      value: user.phoneNumber || "",
      required: true,
      disabled: !isUser
    }) },
    city: { ...register("city", { 
      value: user.city || "",
      required: true,
      disabled: !isUser
    }) },
    state: { ...register("state", { 
      value: user.state || "",
      required: true,
      disabled: !isUser
    }) },
    biography: { ...register("biography", {
      value: user.biography || "",
      required: false, 
      maxLength: 500,
      disabled: !isUser
    }) 
    }
  }

  return (
    <>
      <Snackbar
        open={snackBarMsg.isError || snackBarMsg.isSuccess}
        autoHideDuration={2000}
        onClose={() => setSnackBarMsg({ isError: false, isSuccess: false, msg: null })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={(snackBarMsg.isError) ? "error" : "success"} onClose={() => setSnackBarMsg({ isError: false, isSuccess: false, msg: null })}>
          {snackBarMsg.msg}
        </Alert>
      </Snackbar>
      <div className="min-h-screen bg-neutral-200">
        <NavBar
          user={user}
          uid={uid}
          handleLogout={handleLogout}
          enableSearchBar={false}
          handleSearch={() => ({})}
        />
        <div className="ml-36 mt-4">
          <button onClick={() => router.push(`/home/${uid}`)} className="text-primary-500 p-2 font-semibold hover:bg-neutral-300 rounded-lg transition-colors duration-200 pointer-events-auto">
            <ArrowBackIosIcon fontSize="small" />
            Back To Home
          </button>
        </div>
        <form onSubmit={handleSubmit(editUserHandle)}>
          <div className="items-center justify-center flex flex-col">
            <div className="rounded-md shadow-xl bg-white max-w-7xl w-5/6 mt-4 mb-8">
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
                  <p className="text-lg">{user.personalEmail}</p>
                </div>
                <div>
                  <p>Baylor Email</p>
                  <p className="text-lg">{(user.baylorEmail) ? user.baylorEmail : "No Baylor Email"}</p>
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
            <div className="block pl-6 pr-6 pb-6 pt-2 mb-4 rounded-lg shadow-xl bg-white max-w-7xl min-w-fit w-5/6">
              <div className="border-solid border-neutral-300 border-b-2 bottom-1 pb-1">
                <h3 className="text-xl mt-4">
                  Bio
                </h3>
              </div>
              <textarea { ...validation.biography } defaultValue={user.biography} onInput={(e) => setBiographyLength((e.target as HTMLInputElement).value.length)} placeholder="Enter Bio" className="pl-1 text-md h-40 bg-neutral-100 mt-3 max-w-7xl w-full outline-primary-400 rounded-l resize-none" />
              <h3 className="text-lg">{biographyLength}/500</h3>
              {formErrors.biography && <p className="text-red-500 pb-0 mb-0 text-sm">Biography is too long</p>}
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (context: any) => {

  const { uid } = context.params

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)

  delete user?.connections

  return {
    props: {
      user: user || null,
      uid
    }
  }
}

export default Profile