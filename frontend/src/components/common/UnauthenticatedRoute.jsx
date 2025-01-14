import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UnauthenticatedRoute = ({ children }) => {
  const { token } = useSelector((store) => store.auth);

  if (token !== null) {
    return <Navigate to="/dashboard" />;
  } else {
    return children;
  }
};

export default UnauthenticatedRoute;
