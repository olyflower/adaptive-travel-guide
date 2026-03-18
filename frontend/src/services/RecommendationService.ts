import axios from "axios";
import { LocationData, LocationCity } from "../types/location";

const API_URL = import.meta.env.VITE_API_URL;

export type CityData = LocationCity;

export type RecommendationsResponse = {
	city: CityData;
	locations: LocationData[];
};

export type AddLocationToTripPlanResponse = {
	status: string;
	trip_plan_id: number;
	recommendation_id: number;
	created_new_plan: boolean;
};

/**
 * Generate a cache key for a specific city
 */
const getCacheKey = (city: string) => `recommendations_${city.toLowerCase()}`;
const RECOMMENDATION_CACHE_DURATION = 5 * 60 * 1000;

/**
 * Retrieve cached recommendations for a city if they are still valid
 */
const getCachedRecommendations = (
	city: string,
): RecommendationsResponse | null => {
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

/**
 * Fetch recommendations from the backend API and store them in localStorage cache
 */
const fetchAndCacheRecommendations = async (
	city: string,
): Promise<RecommendationsResponse> => {
	try {
		const url = `${API_URL}/api/locations/recommendations/`;

		const response = await axios.get(url, {
			params: { city },
			withCredentials: true,
		});

		const data: RecommendationsResponse = response.data;

		localStorage.setItem(
			getCacheKey(city),
			JSON.stringify({
				data,
				timestamp: Date.now(),
			}),
		);

		return data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 400) {
				throw new Error("PROFILE_INCOMPLETE");
			}
			if (error.response?.status === 401) {
				throw new Error("UNAUTHORIZED");
			}
			if (error.response?.status === 404) {
				throw new Error("CITY_NOT_FOUND");
			}
		}
		console.error("Error fetching recommendations:", error);

		return {
			city: {
				id: 0,
				name_uk: city,
				name_en: city,
			},
			locations: [],
		};
	}
};

/**
 * Load recommendations for a city
 * Uses cached data if available, otherwise fetches from the API
 */
export const loadRecommendations = async (
	city: string,
): Promise<RecommendationsResponse> => {
	if (!city) {
		return {
			city: {
				id: 0,
				name_uk: "",
				name_en: "",
			},
			locations: [],
		};
	}

	const cached = getCachedRecommendations(city);
	if (cached) return cached;

	return fetchAndCacheRecommendations(city);
};

/**
 * Clear all cached recommendation data from localStorage
 */
export const clearRecommendationCache = () => {
	Object.keys(localStorage).forEach((key) => {
		if (key.startsWith("recommendations_")) {
			localStorage.removeItem(key);
		}
	});
};

/**
 * Clear cached recommendations only for one city
 */
export const clearRecommendationsCacheForCity = (city: string) => {
	localStorage.removeItem(getCacheKey(city));
};

/**
 * Add a selected location to the user's trip plan
 */
export const addLocationToTripPlan = async (
	cityId: number,
	locationId: number,
): Promise<AddLocationToTripPlanResponse> => {
	try {
		const url = `${API_URL}/api/trips/plans/add_location/`;

		const response = await axios.post(
			url,
			{
				city_id: cityId,
				location_id: locationId,
			},
			{
				withCredentials: true,
			},
		);

		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 400) {
				throw new Error("INVALID_DATA");
			}
			if (error.response?.status === 401) {
				throw new Error("UNAUTHORIZED");
			}
		}

		console.error("Error adding location to trip plan:", error);
		throw new Error("ADD_LOCATION_FAILED");
	}
};
