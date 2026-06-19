import axios from "axios";
import { LocationData } from "../types/location";

const API_URL = import.meta.env.VITE_API_URL;

export interface TripPlanCity {
	id: number;
	name: string;
	country_code: string;
	image?: string;
}

export interface TripPlanRecommendation {
	id: number;
	location: LocationData;
}

export interface PlanPhrase {
	phrase_origin: string;
	phrase_translation: string;
	language_code: string;
}

export interface TripPlan {
	id: number;
	city: TripPlanCity;
	start_date: string | null;
	end_date: string | null;
	recommendations: TripPlanRecommendation[];
	phrases: PlanPhrase[];
	created_at: string;
}

export interface TravelInfo {
	weather: {
		city: string;
		country: string;
		temperature: number;
		icon: string;
	} | null;
	currency: {
		from: string;
		to: string;
		rate: number;
	} | null;
}

export interface GeneratedRoute {
	trip_plan_id: number;
	city: string;

	start_point: {
		name: string;
		lat: number;
		lon: number;
	};

	locations: {
		id: number;
		name: string;
		lat: number;
		lon: number;
	}[];

	distance_km: number;
	duration_min: number;

	route_geometry: {
		type: string;
		coordinates: [number, number][];
	};
}

/**
 * Fetch all trip plans created by the current user
 */
export const getMyPlans = async (): Promise<TripPlan[]> => {
	const response = await axios.get<TripPlan[]>(
		`${API_URL}/api/trips/plans/`,
		{
			withCredentials: true,
		},
	);
	return response.data;
};

/**
 * Fetch detailed information for a specific trip plan
 */
export const getPlanDetails = async (planId: string): Promise<TripPlan> => {
	const response = await axios.get<TripPlan>(
		`${API_URL}/api/trips/plans/${planId}/`,
		{
			withCredentials: true,
		},
	);
	return response.data;
};

/**
 * Delete a trip plan by its id
 */
export const deletePlan = async (planId: string): Promise<void> => {
	await axios.delete(`${API_URL}/api/trips/plans/${planId}/`, {
		withCredentials: true,
	});
};

/**
 * Remove a saved recommendation from a trip plan
 */
export const removeRecommendationFromPlan = async (
	recommendationId: number,
): Promise<void> => {
	await axios.delete(
		`${API_URL}/api/trips/recommendations/${recommendationId}/`,
		{
			withCredentials: true,
		},
	);
};

/**
 * Fetch live weather and currency information for a city
 */
export const getCityTravelInfo = async (
	cityId: number,
): Promise<TravelInfo> => {
	const response = await axios.get<TravelInfo>(
		`${API_URL}/api/trips/cities/${cityId}/travel-info/`,
		{ withCredentials: true },
	);

	return response.data;
};

/**
 * Update travel dates for a specific trip plan
 */
export const updateTripDates = async (
	planId: string,
	payload: { start_date: string | null; end_date: string | null },
): Promise<TripPlan> => {
	const response = await axios.patch(
		`${API_URL}/api/trips/plans/${planId}/`,
		payload,
		{
			withCredentials: true,
		},
	);
	return response.data;
};

/**
 * Generate optimized route for trip plan
 */
export const generateRoute = async (
	planId: string,
): Promise<GeneratedRoute> => {
	const response = await axios.get<GeneratedRoute>(
		`${API_URL}/api/trips/plans/${planId}/generate_route/`,
		{
			withCredentials: true,
		},
	);

	return response.data;
};
