import axios from "axios";
import { ProfileFormValues } from "../hooks/useProfileForm";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Handles user profile API requests (with cookies)
 */

export const getProfile = async () => {
	const response = await axios.get(`${API_URL}/api/auth/profile/save-full/`, {
		withCredentials: true,
	});

	return response.data;
};

export const saveProfile = async (values: ProfileFormValues) => {
	await axios.post(`${API_URL}/api/auth/profile/save-full/`, values, {
		withCredentials: true,
	});
};
