import { Navigate } from "react-router-dom";

// Legacy route kept for existing links; canonical page is /veterans.
const Veterans = () => <Navigate to="/veterans" replace />;

export default Veterans;
