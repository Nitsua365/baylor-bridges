import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import React from "react"
import { Avatar } from "@mui/material"

const UserModal: React.FC<UserModalProps> = ({ 
  user, 
  profileImage, 
  open=false, 
  handleClose,
  handleConnect,
  disableConnect
}) => {
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8/12 bg-neutral-100 border-2 border-solid border-neutral-600 shadow-2xl pt-2 pl-4 pr-4 pb-3">
          <div className="flex flex-row pl-4 pr-16 pt-4 pb-4">
            <div>
              <Avatar
                alt={`${user.firstName} ${user.lastName}`} 
                src={profileImage || ""}
                sx={{ width: 72, height: 72, cursor: "pointer" }}
                className="mr-4"
              >
                {`${user.firstName.substring(0, 1)}${user.lastName.substring(0, 1)}`}
              </Avatar>
            </div>
            <div className="flex-initial w-full max-w-xl mr-96">
              <h1 className="text-3xl font-semibold mt-2">
                {`${user.firstName} ${user.lastName}`}
              </h1>
              <h3 className="text-xl text-neutral-500">
                {user.city}, {user.state}
              </h3>
            </div>
            <div className="flex-end ml-8 mt-1">
              <button onClick={() => handleConnect()} disabled={disableConnect} className="border-2 p-4 disabled:bg-neutral-500 disabled:bg-none bg-gradient-to-r from-primary-500 to-primaryTwo-600 text-white font-medium text-sm leading-tight rounded-md shadow-md hover:bg-primary-500 hover:shadow-lg focus:bg-primary-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primaryTwo-600 active:shadow-lg">
                CONNECT
              </button>
            </div>
          </div>
          {user.biography && (
            <>
              <div className="text-xl border-b-2 border-neutral-300">
                Bio
              </div>
              <div className="flex mt-4">
                {user.biography}
              </div>
            </>)
          }
        </Box>
      </Modal>
    </>
  )
}

export default UserModal