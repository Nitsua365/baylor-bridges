import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import React from "react"

const UserModal: React.FC<{ user: UserDTO, open: boolean, handleClose: () => void }> = ({ user, open=false, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-400 bg-neutral-100 border-2 border-solid border-neutral-700 shadow-2xl pt-2 pl-4 pr-4 pb-3">
        <h2 id="parent-modal-title">{user.firstName} {user.lastName}</h2>
      </Box>
    </Modal>
  )
}

export default UserModal