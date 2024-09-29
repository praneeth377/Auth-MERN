import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signIn } from "../services/authService"

function SignIn() {
  const [formData, setFormData] = useState({email: '', password: ''})
  const [disable, setDisable] = useState(true)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    if (formData.email.length > 0 && formData.password.length > 1) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      await signIn(formData)

      setLoading(false)
      setError(false)
      navigate("/")
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setLoading(false)
      setError(true)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
        type="email"
        placeholder='Email'
        id='email'
        className='bg-slate-100 p-3 rounded-lg'
        onChange={handleChange}
        />
        <input
        type="password"
        placeholder='Password'
        id='password'
        className='bg-slate-100 p-3 rounded-lg'
        onChange={handleChange}
        />
        <button disabled={disable} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Do not have an account?</p>
        <Link to="/sign-up"><span className='text-blue-500'>Sign Up</span></Link>
      </div>
      <p className="text-red-700 mt-5">{error && 'Something went wrong! Try again'}</p>
    </div>
  )
}

export default SignIn;
