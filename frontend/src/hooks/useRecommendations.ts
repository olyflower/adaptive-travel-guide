import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	loadRecommendations,
	LocationData,
	CityData,
} from "../services/RecommendationService";

type UseRecommendationsReturn = {
	city: CityData | null;
	recommendations: LocationData[];
	loading: boolean;
	error: string;
	isProfileIncomplete: boolean;
	tripPlanId: number | null;
	handleLocationAdded: (locationId: number, planId: number) => void;
	refetchRecommendations: () => Promise<void>;
};

/**
 * Hook for managing recommendations page state and logic
 * Handles data fetching, error states, and optimistic UI updates
 */

export const useRecommendations = (
	cityQuery: string,
): UseRecommendationsReturn => {
	const navigate = useNavigate();

	const [city, setCity] = useState<CityData | null>(null);
	const [recommendations, setRecommendations] = useState<LocationData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
	const [tripPlanId, setTripPlanId] = useState<number | null>(null);

	const fetchRecommendations = useCallback(async () => {
		if (!cityQuery) {
			setError("recommendations.city_not_specified");
			setLoading(false);
			return;
		}

		setLoading(true);
		setError("");
		setIsProfileIncomplete(false);
		setTripPlanId(null);

		try {
			const data = await loadRecommendations(cityQuery);
			setCity(data.city);
			setRecommendations(data.locations);
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.message) {
					case "PROFILE_INCOMPLETE":
						setError("recommendations.profile_incomplete");
						setIsProfileIncomplete(true);
						break;
					case "CITY_NOT_FOUND":
						setError("recommendations.city_not_found");
						break;
					case "UNAUTHORIZED":
						navigate("/login");
						return;
					default:
						setError("recommendations.error_general");
				}
			} else {
				setError("recommendations.error_general");
			}
		} finally {
			setLoading(false);
		}
	}, [cityQuery, navigate]);

	useEffect(() => {
		fetchRecommendations();
	}, [fetchRecommendations]);

	const handleLocationAdded = (locationId: number, planId: number) => {
		setTripPlanId(planId);

		setRecommendations((prev) =>
			prev.map((location) =>
				location.id === locationId
					? { ...location, is_in_trip: true }
					: location,
			),
		);
	};

	return {
		city,
		recommendations,
		loading,
		error,
		isProfileIncomplete,
		tripPlanId,
		handleLocationAdded,
		refetchRecommendations: fetchRecommendations,
	};
};
