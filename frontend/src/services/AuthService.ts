import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Authentication API service
 * Contains requests for login, logout, registration and password reset
 */

/**
 * Send login request with user credentials
 */
export const loginRequest = async (email: string, password: string) => {
	const response = await axios.post(
		`${API_URL}/api/auth/login/`,
		{ email, password },
		{ withCredentials: true },
	);
	return response.data;
};

/**
 * Log out the current user
 */
export const logoutRequest = async () => {
	await axios.post(
		`${API_URL}/api/auth/logout/`,
		{},
		{ withCredentials: true },
	);
};

/**
 * Check if the current user session is authenticated
 */
export const checkAuthStatusRequest = async () => {
	const response = await axios.get(`${API_URL}/api/auth/status/`, {
		withCredentials: true,
	});
	return {
		isAuthenticated: response.data.isAuthenticated,
		user: response.data.user || null,
	};
};

/**
 * Register a new user account
 */
export const registerUserRequest = async (
	email: string,
	username: string,
	password: string,
) => {
	const response = await axios.post(
		`${API_URL}/api/auth/register/`,
		{ email, username, password },
		{ withCredentials: true },
	);
	return response.data;
};

/**
 * Request a password reset email
 */
export const requestPasswordResetRequest = async (email: string) => {
	const response = await axios.post(`${API_URL}/api/auth/password-reset/`, {
		email,
	});
	return response.data;
};

/**
 * Confirm password reset with token and set a new password
 */
export const confirmPasswordResetRequest = async (
	uid: string,
	token: string,
	newPassword: string,
) => {
	const response = await axios.post(
		`${API_URL}/api/auth/password-reset-confirm/`,
		{ uid, token, new_password: newPassword },
	);
	return response.data;
};

/**
 * Authenticate user via Google OAuth using ID token
 */
export const googleLoginRequest = async (idToken: string) => {
	const response = await axios.post(
		`${API_URL}/api/auth/google/`,
		{ id_token: idToken },
		{ withCredentials: true },
	);
	return response.data;
};
