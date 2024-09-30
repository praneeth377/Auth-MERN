import {signInSuccess, signInStart} from "../redux/user/userSlice"
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import {GoogleAuthProvider, signInWithPopup, getAuth} from "firebase/auth"
import { app } from "../firebase"
import {google} from "../services/authService"

function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {loading, error} = useSelector((state) => state.user)

    const handleGoogleClick = async () => {
        try {
            dispatch(signInStart())
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            //console.log(result)

            const data = {name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}
            const response = await google(data)
            console.log(response.data)

            dispatch(signInSuccess(data))
            navigate("/")
        } catch (error) {
            console.log('Could not login with google', error)
        }
    }

  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>Continue with Google</button>
  )
}

export default OAuth;
