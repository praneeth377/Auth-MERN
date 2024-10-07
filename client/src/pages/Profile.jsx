import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import { updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import { update } from "../services/updateService";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [inputData, setInputData] = useState({username: currentUser.username, email: currentUser.email, password: ''})
  const dispatch = useDispatch()
  console.log(formData)
  console.log(inputData)

  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      console.log("User not authenticated");
      return;
    }
  }, [currentUser]);

  // Handle image upload function
  const handleImageUpload = (image) => {
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setImageError(false);
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.floor(progress));
        console.log("Upload progress:", imagePercent);
      },
      (error) => {
        setImageError(true);
        console.error("Image upload error:", error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({ ...prevData, profile_pic: downloadURL }));
        });
      }
    );
  };

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  const handleChange = (e) => {
    const {id, value} = e.target
    setInputData(i => ({...i, [id]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())

      const response = await update(currentUser._id, {...inputData, profile_pic: formData.profile_pic || currentUser?.profile_pic})
      const data = response.data
      console.log(data)

      dispatch(updateUserSuccess(data))

    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  }


  return (
    <div className="p-3 max-w-lg mx-auto border-2 border-blue-500">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profile_pic || currentUser?.profile_pic}
          alt="profile-pic"
          onClick={() => fileRef.current.click()}
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
        />
        <p className="text-center text-sm font-extralight">
          {imageError ?
          (<span className="text-red-700">Error uploading image, max 2MB is allowed.</span>) :
          imagePercent > 0 && imagePercent < 100 ?
          (<span className="text-blue-700">{`Uploading image ${imagePercent} %`}</span>) :
          imagePercent === 100 ?
          (<span className="text-green-700">Image uploaded successfully !</span>) :
          (<span></span>)}
        </p>
        <input
          defaultValue={currentUser?.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser?.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex flex-row justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
