import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	loadRecommendations,
	CityData,
} from "../services/RecommendationService";
import { LocationData } from "../types/location";

type UseRecommendationsReturn = {
	city: CityData | null;
	recommendations: LocationData[];
	loading: boolean;
	error: string | null;
	isProfileIncomplete: boolean;
	tripPlanId: number | null;
	handleLocationAdded: (locationId: number, planId: number) => void;
	refetchRecommendations: () => Promise<void>;
};

/**
 * Hook for managing recommendations page state and logic.
 *
 * Handles:
 * - loading recommendations for a city
 * - loading and error states
 * - profile incomplete state
 * - redirect on unauthorized access
 * - optimistic update after adding location to plan
 */

export const useRecommendations = (
	cityQuery: string,
): UseRecommendationsReturn => {
	const navigate = useNavigate();

	const [city, setCity] = useState<CityData | null>(null);
	const [recommendations, setRecommendations] = useState<LocationData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
	const [tripPlanId, setTripPlanId] = useState<number | null>(null);

	const fetchRecommendations = useCallback(async () => {
		if (!cityQuery) {
			setCity(null);
			setRecommendations([]);
			setTripPlanId(null);
			setIsProfileIncomplete(false);
			setError("recommendations.city_not_specified");
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		setIsProfileIncomplete(false);
		setTripPlanId(null);
		setCity(null);
		setRecommendations([]);
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
		let isActive = true;

		const loadData = async () => {
			if (!cityQuery) {
				if (!isActive) return;
				setCity(null);
				setRecommendations([]);
				setTripPlanId(null);
				setIsProfileIncomplete(false);
				setError("recommendations.city_not_specified");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);
				setIsProfileIncomplete(false);
				setTripPlanId(null);
				setCity(null);
				setRecommendations([]);

				const data = await loadRecommendations(cityQuery);

				if (!isActive) return;
				setCity(data.city);
				setRecommendations(data.locations);
			} catch (err: unknown) {
				if (!isActive) return;

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
				if (isActive) {
					setLoading(false);
				}
			}
		};

		loadData();

		return () => {
			isActive = false;
		};
	}, [cityQuery, navigate]);

	const handleLocationAdded = useCallback(
		(locationId: number, planId: number) => {
			setTripPlanId(planId);

			setRecommendations((prev) =>
				prev.map((location) =>
					location.id === locationId
						? { ...location, is_in_trip: true }
						: location,
				),
			);
		},
		[],
	);

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
