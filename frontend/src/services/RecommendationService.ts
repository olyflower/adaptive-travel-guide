import axios from "axios";

export type LocationData = {
	id: number;
	name_uk: string;
	name_en: string;
	description_uk?: string;
	description_en?: string;
	city: {
		id: number;
		name_uk: string;
		name_en: string;
	};
	category?: {
		id: number;
		name_uk: string;
		name_en: string;
	};
	distance?: number;
};

const getCacheKey = (city: string) => `recommendations_${city.toLowerCase()}`;
const RECOMMENDATION_CACHE_DURATION = 5 * 60 * 1000;

const getCachedRecommendations = (city: string): LocationData[] | null => {
	const cached = localStorage.getItem(getCacheKey(city));
	if (!cached) return null;

	try {
		const parsed = JSON.parse(cached);

		if (Date.now() - parsed.timestamp < RECOMMENDATION_CACHE_DURATION) {
			return parsed.data;
		}
	} catch {
		return null;
	}

	return null;
};

const fetchAndCacheRecommendations = async (
	city: string,
): Promise<LocationData[]> => {
	try {
		const url = `${import.meta.env.VITE_API_URL}/api/locations/recommendations/`;

		const response = await axios.get(url, {
			params: { city },
			withCredentials: true,
		});

		const data: LocationData[] = response.data;

		localStorage.setItem(
			getCacheKey(city),
			JSON.stringify({
				data,
				timestamp: Date.now(),
			}),
		);

		return data;
	} catch (error: any) {
		if (error.response?.status === 400) {
			throw new Error("PROFILE_INCOMPLETE");
		}
		if (error.response?.status === 401) {
			throw new Error("UNAUTHORIZED");
		}
		console.error("Error fetching recommendations:", error);
		return [];
	}
};

export const loadRecommendations = async (
	city: string,
): Promise<LocationData[]> => {
	if (!city) return [];

	const cached = getCachedRecommendations(city);
	if (cached) return cached;

	return await fetchAndCacheRecommendations(city);
};

export const clearRecommendationCache = () => {
	Object.keys(localStorage).forEach((key) => {
		if (key.startsWith("recommendations_")) {
			localStorage.removeItem(key);
		}
	});
};
