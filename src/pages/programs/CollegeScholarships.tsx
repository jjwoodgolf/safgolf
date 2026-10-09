import { Navigate } from "react-router-dom";

// Legacy route kept for existing links; canonical page is /scholarships.
const CollegeScholarships = () => <Navigate to="/scholarships" replace />;

export default CollegeScholarships;
