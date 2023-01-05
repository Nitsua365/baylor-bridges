import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import React from "react"
import { Avatar } from "@mui/material"

const UserModal: React.FC<{ user: UserDTO, profileImage: string, open: boolean, handleClose: () => void }> = ({ user, profileImage, open=false, handleClose }) => {
  return (
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
            <h1 className="text-3xl font-semibold mt-4">
              {`${user.firstName} ${user.lastName}`}
            </h1>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default UserModal