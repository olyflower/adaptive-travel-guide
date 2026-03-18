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

export const getMyPlans = async (): Promise<TripPlan[]> => {
	const response = await axios.get<TripPlan[]>(
		`${API_URL}/api/trips/plans/`,
		{
			withCredentials: true,
		},
	);
	return response.data;
};

export const getPlanDetails = async (planId: string): Promise<TripPlan> => {
	const response = await axios.get<TripPlan>(
		`${API_URL}/api/trips/plans/${planId}/`,
		{
			withCredentials: true,
		},
	);
	return response.data;
};

export const deletePlan = async (planId: string): Promise<void> => {
	await axios.delete(`${API_URL}/api/trips/plans/${planId}/`, {
		withCredentials: true,
	});
};

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

export const getCityTravelInfo = async (
	cityId: number,
): Promise<TravelInfo> => {
	const response = await axios.get<TravelInfo>(
		`${API_URL}/api/trips/cities/${cityId}/travel-info/`,
		{ withCredentials: true },
	);

	return response.data;
};
