import { useSelector } from "react-redux"

function Profile() {
  const {currentUser} = useSelector(state => state.user)

  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form action="">
        <img src={currentUser.profile_pic} alt="profile-pic" />
      </form>
    </div>
  )
}

export default Profile
