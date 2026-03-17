import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

/**
 * Protects routes that require user authentication.
 */

type PrivateRouteProps = {
	children: ReactNode;
};

function PrivateRoute({ children }: PrivateRouteProps) {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return children;
}

export default PrivateRoute;
