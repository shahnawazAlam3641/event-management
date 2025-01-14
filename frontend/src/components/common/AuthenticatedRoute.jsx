import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AuthenticatedRoute({ children }) {
  const { token } = useSelector((store) => store.auth);

  if (token !== null) {
    return children;
  } else {
    return <Navigate to="/register" />;
  }
}

export default AuthenticatedRoute;
