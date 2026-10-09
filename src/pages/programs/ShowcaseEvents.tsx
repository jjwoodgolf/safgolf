import { Navigate } from "react-router-dom";

// Legacy route kept for existing links; canonical page is /events.
const ShowcaseEvents = () => <Navigate to="/events" replace />;

export default ShowcaseEvents;
