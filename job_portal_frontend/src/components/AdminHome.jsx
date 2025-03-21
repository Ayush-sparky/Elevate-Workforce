import React from 'react'

const AdminHome = ({name}) => {
  return (
    <div className=' text-black w-3/4 h-full'>
      <h1>Welcome {name}?</h1>
      This is the Home Page of the Admin Panel
    </div>
  )
}

export default AdminHome
