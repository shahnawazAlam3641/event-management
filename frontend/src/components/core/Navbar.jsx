import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addUser, logout } from "../../store/slices/authSlice";
import { useEffect } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  // console.log(token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/register");
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.user) {
        dispatch(addUser(response?.data?.user));
      }
    } catch (error) {
      console.error(error);
      dispatch(logout());
      navigate("/register");
    }
  };

  useEffect(() => {
    if (!user && token) {
      // console.log("fetchuser called");
      fetchUserDetails();
    }
  }, [token]);

  return (
    <nav className="flex gap-2 min-h-[8vh] shadow-lg py-3 px-6 justify-between items-center">
      <h1 className="text-xl font-bold text-[#212121]">
        {" "}
        <Link to="/">Event Management</Link>{" "}
      </h1>
      <ul className="flex gap-2 text-[#212121]">
        {user ? (
          <>
            <li>
              <button onClick={handleLogout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li className="py-1 px-2 border-2 text-white w-fit border-[#E54065] bg-[#E54065]  hover:text-black rounded-md hover:bg-white transition-colors duration-200">
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
