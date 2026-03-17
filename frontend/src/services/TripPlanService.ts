import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface TripPlan {
	id: number;
	city: {
		id: number;
		name: string;
		country_code: string;
		image?: string;
	};
	start_date: string | null;
	end_date: string | null;
	recommendations: any[];
	phrases: {
		phrase_origin: string;
		phrase_translation: string;
		language_code: string;
	}[];
	created_at: string;
}

export type TravelInfo = {
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
};

export const getMyPlans = async (): Promise<TripPlan[]> => {
	const response = await axios.get(`${API_URL}/api/trips/plans/`, {
		withCredentials: true,
	});
	return response.data;
};

export const getPlanDetails = async (id: string): Promise<TripPlan> => {
	const response = await axios.get(`${API_URL}/api/trips/plans/${id}/`, {
		withCredentials: true,
	});
	return response.data;
};

export const deletePlan = async (id: string): Promise<void> => {
	await axios.delete(`${API_URL}/api/trips/plans/${id}/`, {
		withCredentials: true,
	});
};

export const removeRecommendationFromPlan = async (
	recommendationId: number,
) => {
	await axios.delete(
		`${API_URL}/api/trips/recommendations/${recommendationId}/`,
		{
			withCredentials: true,
		},
	);
};

export const getCityTravelInfo = async (
	cityId: number,
): Promise<TravelInfo> => {
	const response = await axios.get(
		`${API_URL}/api/trips/cities/${cityId}/travel-info/`,
		{ withCredentials: true },
	);

	return response.data;
};
