import { useEffect, useState } from "react";
import { Category } from "../types/preferences";
import axios from "axios";

/**
 * Custom hook to fetch user preference categories from the backend
 * 
 * Returns:
 * - categories: list of preference categories with options
 * - loading: request loading state
 * - error: error message if the request fails
 */

export const usePreferences = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPreferences = async () => {
			try {
				const response = await axios.get<Category[]>(
					`${import.meta.env.VITE_API_URL}/api/preferences/all/`,
					{ withCredentials: true },
				);
				setCategories(response.data);
			} catch (err) {
				setError("Failed to load preferences");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchPreferences();
	}, []);

	return { categories, loading, error };
};
