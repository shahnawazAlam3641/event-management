import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="h-[92vh] flex flex-col gap-5 justify-center items-center">
      <div className="flex flex-col ">
        <h1 className="text-6xl font-manrope font-black leading-snug text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-600 to-purple-600  text-center">
          Plan, Manage, Succeed!
        </h1>
        <p className="text-center text-slate-500">
          Seamless Events, Unforgettable Experiences
        </p>
      </div>
      <div className="flex gap-2 ">
        <button className="py-1 px-2 border-2 text-white w-fit border-[#E54065] bg-[#E54065]  hover:text-black rounded-md hover:bg-white transition-colors duration-200">
          Sign In
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="py-1 px-2 border-2 text-white w-fit border-[#E54065]   bg-[#E54065] hover:text-black rounded-md hover:bg-white transition-colors duration-200"
        >
          Explore as Guest
        </button>
      </div>
    </div>
  );
};

export default Home;
