import Avatar from "@mui/material/Avatar"
import React from "react"

const UserCard: React.FC<UserCardProps> = ({ profileImageUrl, user }) => {
  return (
    <div key={user.uid} className="group flex flex-initial items-center justify-between pl-2 pb-2 pt-2 rounded-md shadow-md hover:shadow-xl transition-shadow duration-200 bg-gradient-to-r from-neutral-200 via-neutral-200 to-neutral-300 max-w-full min-w-fit w-11/12 mb-8 cursor-pointer">
      <div className="flex-col">
        <h1 className="font-bold text-primary-600 group-hover:text-primary-500 group-hover:underline">{user.firstName} {user.lastName}</h1>
        <p>{user.city}, {user.state}</p>
        <p className="font-light text-sm max-w-2xl">{user.biography}</p>
      </div>
      <div className="flex-row mr-3">
        <Avatar
          src={profileImageUrl || ""}
          alt={`${user.firstName} ${user.lastName}`}
          sx={{ width: 64, height: 64 }}
        >
          {`${user?.firstName.substring(0, 1)}${user.lastName.substring(0, 1)}`}
        </Avatar>
      </div>
    </div>
  )
}

export default UserCard