import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/requestUrl";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);

  //sends user google details to server and logs the user in
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); //asks user to select the account

    try {
      const resultsFrmGoogle = await signInWithPopup(auth, provider);

      const response = await axios.post(
        `${BASE_URL}/google`,
        JSON.stringify({
          name: resultsFrmGoogle.user.displayName,
          email: resultsFrmGoogle.user.email,
          photoUrl: resultsFrmGoogle.user.photoURL,
        }),
        {
          headers: { "Content-Type": "Application/json" },
          withCredentials: true,
        }
      );

      dispatch(signInSuccess(response.data?.userWithoutPwd));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200 outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800"
    >
      <FontAwesomeIcon icon={faGoogle} className="text-red-500 text-lg" />
      Continue with Google
    </button>
  );
};

export default OAuth;
