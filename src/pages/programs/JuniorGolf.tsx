import { Navigate } from "react-router-dom";

// Legacy route kept for existing links; canonical page is /junior-golf.
const JuniorGolf = () => <Navigate to="/junior-golf" replace />;

export default JuniorGolf;
