import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	deletePlan,
	getCityTravelInfo,
	getPlanDetails,
	removeRecommendationFromPlan,
	updateTripDates,
	TravelInfo,
	TripPlan,
} from "../services/TripPlanService";
import { clearRecommendationCache } from "../services/RecommendationService";

type UsePlanDetailsReturn = {
	plan: TripPlan | null;
	travelInfo: TravelInfo | null;
	loading: boolean;
	isDeleting: boolean;
	isUpdatingDates: boolean;
	error: string | null;
	actionError: string | null;
	handleDeletePlan: () => Promise<void>;
	handleRemoveLocation: (recommendationId: number) => Promise<void>;
	handleUpdateDates: (
		startDate: string | null,
		endDate: string | null,
	) => Promise<boolean>;
};

/**
 * Hook for handling Trip Plan Details page logic
 *
 * Fetches trip plan details and related travel info,
 * and provides handlers for deleting the plan,
 * removing saved recommendations, and updating trip dates
 *
 * Includes separate loading states for page loading,
 * plan deletion, and date updates, as well as
 * separate error handling for page load and user actions
 */

export const usePlanDetails = (
	id: string | undefined,
): UsePlanDetailsReturn => {
	const navigate = useNavigate();

	const [plan, setPlan] = useState<TripPlan | null>(null);
	const [travelInfo, setTravelInfo] = useState<TravelInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isUpdatingDates, setIsUpdatingDates] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);

	useEffect(() => {
		let isActive = true;

		const loadPlanDetails = async () => {
			if (!id) {
				setPlan(null);
				setTravelInfo(null);
				setError("Plan id is missing");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);
				setActionError(null);
				setPlan(null);
				setTravelInfo(null);

				const data = await getPlanDetails(id);

				if (!isActive) return;
				setPlan(data);
			} catch (err) {
				if (!isActive) return;
				console.error(err);
				setPlan(null);
				setTravelInfo(null);
				setError("Failed to load plan details");
			} finally {
				if (isActive) {
					setLoading(false);
				}
			}
		};

		loadPlanDetails();

		return () => {
			isActive = false;
		};
	}, [id]);

	const cityId = plan?.city?.id;

	useEffect(() => {
		if (!cityId) {
			setTravelInfo(null);
			return;
		}

		let isActive = true;

		const loadTravelInfo = async () => {
			try {
				const data = await getCityTravelInfo(cityId);

				if (!isActive) return;
				setTravelInfo(data);
			} catch (err) {
				if (!isActive) return;
				console.error(err);
				setTravelInfo(null);
				setActionError("Failed to load travel info");
			}
		};

		loadTravelInfo();

		return () => {
			isActive = false;
		};
	}, [cityId]);

	const handleDeletePlan = useCallback(async () => {
		if (!id || isDeleting) return;

		try {
			setIsDeleting(true);
			setActionError(null);
			await deletePlan(id);
			navigate("/plans");
		} catch (err) {
			console.error(err);
			setActionError("Failed to delete plan");
		} finally {
			setIsDeleting(false);
		}
	}, [id, isDeleting, navigate]);

	const handleRemoveLocation = useCallback(
		async (recommendationId: number) => {
			try {
				setActionError(null);
				await removeRecommendationFromPlan(recommendationId);

				setPlan((prev) =>
					prev
						? {
								...prev,
								recommendations: prev.recommendations.filter(
									(rec) => rec.id !== recommendationId,
								),
							}
						: prev,
				);

				clearRecommendationCache();
			} catch (err) {
				console.error(err);
				setActionError("Failed to remove location from plan");
			}
		},
		[],
	);
	const handleUpdateDates = useCallback(
		async (startDate: string | null, endDate: string | null) => {
			if (!id) return false;

			try {
				setIsUpdatingDates(true);
				setActionError(null);

				const updatedPlan = await updateTripDates(id, {
					start_date: startDate,
					end_date: endDate,
				});

				setPlan(updatedPlan);
				return true;
			} catch (err) {
				console.error(err);
				setActionError("Failed to update trip dates");
				return false;
			} finally {
				setIsUpdatingDates(false);
			}
		},
		[id],
	);

	return {
		plan,
		travelInfo,
		loading,
		isDeleting,
		isUpdatingDates,
		error,
		actionError,
		handleDeletePlan,
		handleRemoveLocation,
		handleUpdateDates,
	};
};
