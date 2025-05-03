import axios from "axios";

export const loginRequest = async (email: string, password: string) => {
	const response = await axios.post(
		`${import.meta.env.VITE_API_URL}/api/auth/login/`,
		{ email, password },
		{ withCredentials: true }
	);
	return response.data;
};

export const logoutRequest = async () => {
	await axios.post(
		`${import.meta.env.VITE_API_URL}/api/auth/logout/`,
		{},
		{ withCredentials: true }
	);
};

export const checkAuthStatusRequest = async () => {
	const response = await axios.get(
		`${import.meta.env.VITE_API_URL}/api/auth/status/`,
		{ withCredentials: true }
	);
	return response.data.isAuthenticated;
};

export const registerUserRequest = async (
	email: string,
	username: string,
	password: string
) => {
	const response = await axios.post(
		`${import.meta.env.VITE_API_URL}/api/auth/register/`,
		{ email, username, password },
		{ withCredentials: true }
	);
	return response.data;
};

export const requestPasswordResetRequest = async (email: string) => {
	const response = await axios.post(
		`${import.meta.env.VITE_API_URL}/api/auth/password-reset/`,
		{ email }
	);
	return response.data;
};

export const confirmPasswordResetRequest = async (
	uid: string,
	token: string,
	newPassword: string
) => {
	const response = await axios.post(
		`${import.meta.env.VITE_API_URL}/api/auth/password-reset-confirm/`,
		{ uid, token, new_password: newPassword }
	);
	return response.data;
};
