import React, { useEffect } from "react";
import axios from "axios";

const Login: React.FC = () => {
	useEffect(() => {
		axios.get(`${import.meta.env.VITE_API_URL}/api/me/`, { withCredentials: true })
			.then(response => {
				console.log("Backend response:", response.data);
			})
			.catch(error => {
				console.error("Error:", error);
			});
	}, []);

	return <h2>Test</h2>;
};

export default Login;
