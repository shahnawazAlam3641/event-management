import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/slices/loadingSlice";
import { login } from "../../store/slices/authSlice";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const [isSignInPage, setIsSignInPage] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  const { user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  const handleFormSubmit = async (e) => {
    try {
      e.target.disabled = true;
      dispatch(setLoading(true));
      if (isSignInPage) {
        const response = await axios.post(BASE_URL + "auth/register", {
          fullName: nameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        });

        if (response.data.success) {
          localStorage.setItem("auth_token", response?.data?.token);
          dispatch(
            login({ user: response.data.user, token: response.data.token })
          );
          setErrorMessage("");
          navigate("/dashboard");
          e.target.disabled = false;
          dispatch(setLoading(false));
        }
      } else {
        const response = await axios.post(BASE_URL + "auth/login", {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        });

        if (response.data.success) {
          localStorage.setItem("auth_token", response?.data?.token);
          dispatch(
            login({ user: response.data.user, token: response.data.token })
          );
          setErrorMessage("");
          navigate("/dashboard");
          e.target.disabled = false;
          dispatch(setLoading(false));
        }
      }
    } catch (error) {
      e.target.disabled = false;
      dispatch(setLoading(false));
      console.error(error);
      setErrorMessage(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div className="flex justify-center items-center  w-full h-[92vh]">
      <form
        className="flex flex-col gap-3 p-6 bg-white w-80 border-borderColor shadow-md rounded-md m-auto max-w-[95%]"
        onSubmit={(e) => e.preventDefault()}
      >
        <h3 className="text-center text-md font-semibold">
          {isSignInPage ? "Sign Up" : "Sign In"}
        </h3>
        {isSignInPage && (
          <input
            ref={nameRef}
            type="text"
            placeholder="Enter your Name"
            className="py-2 px-4 border border-borderColor rounded-md w-full"
          />
        )}
        <input
          ref={emailRef}
          type="email"
          placeholder="Enter your Email"
          className="py-2 px-4 border border-borderColor rounded-md w-full"
        />
        <div className="relative">
          <input
            ref={passwordRef}
            type={!showPassword ? "password" : "text"}
            placeholder="Enter your Password"
            className="py-2 px-4 border border-borderColor rounded-md w-full"
          />
          <div
            className="cursor-pointer absolute right-[5%] top-1/2 -translate-y-[50%]"
            onClick={() => setShowPassword(!showPassword)}
          >
            show
          </div>
        </div>
        <p
          onClick={() => setIsSignInPage(!isSignInPage)}
          className="text-xs cursor-pointer"
        >
          {isSignInPage
            ? "Already have an Account? Sign In Now."
            : "Don't have an Account? Sign Up Now"}
        </p>

        {errorMessage && (
          <p className="text-xs text-red-500"> {errorMessage} </p>
        )}

        <button
          onClick={(e) => handleFormSubmit(e)}
          type="submit"
          className="bg-[#E54065]  mt-3 py-2 px-3 self-center hover:bg-white hover:text-[#212121] border-2 border-[#E54065] transition-colors duration-200 text-white rounded-md w-fit"
        >
          {isSignInPage ? "Sign Up" : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Register;
