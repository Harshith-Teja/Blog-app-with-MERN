import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "flowbite-react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = getAuth(app);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); //asks user to select the account

    try {
      const resultsFrmGoogle = await signInWithPopup(auth, provider);
      console.log(resultsFrmGoogle);

      const response = await axios.post(
        "http://localhost:5000/google",
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
    <Button
      type="button"
      className="w-full mt-2"
      gradientDuoTone="purpleToBlue"
      outline
      onClick={handleGoogleClick}
    >
      <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 mr-2" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
