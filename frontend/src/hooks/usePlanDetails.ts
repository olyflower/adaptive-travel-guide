import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	deletePlan,
	getCityTravelInfo,
	getPlanDetails,
	removeRecommendationFromPlan,
	TravelInfo,
	TripPlan,
} from "../services/TripPlanService";
import { clearRecommendationCache } from "../services/RecommendationService";

type UsePlanDetailsReturn = {
	plan: TripPlan | null;
	travelInfo: TravelInfo | null;
	loading: boolean;
	isDeleting: boolean;
	handleDeletePlan: () => Promise<void>;
	handleRemoveLocation: (recommendationId: number) => Promise<void>;
};

/**
 * Hook for fetching and managing a single trip plan details page
 *
 * Handles:
 * - loading trip plan details
 * - loading related travel info
 * - deleting the whole plan
 * - removing locations from the plan
 */

export const usePlanDetails = (
	id: string | undefined,
): UsePlanDetailsReturn => {
	const navigate = useNavigate();

	const [plan, setPlan] = useState<TripPlan | null>(null);
	const [travelInfo, setTravelInfo] = useState<TravelInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchPlanDetails = useCallback(async () => {
		if (!id) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const data = await getPlanDetails(id);
			setPlan(data);
		} catch (err) {
			console.error(err);
			setPlan(null);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPlanDetails();
	}, [fetchPlanDetails]);

	useEffect(() => {
		if (!plan?.city?.id) return;

		const fetchTravelInfo = async () => {
			try {
				const data = await getCityTravelInfo(plan.city.id);
				setTravelInfo(data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchTravelInfo();
	}, [plan]);

	const handleDeletePlan = async () => {
		if (!id || isDeleting) return;

		try {
			setIsDeleting(true);
			await deletePlan(id);
			navigate("/plans");
		} catch (err) {
			console.error(err);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleRemoveLocation = async (recommendationId: number) => {
		try {
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
		}
	};

	return {
		plan,
		travelInfo,
		loading,
		isDeleting,
		handleDeletePlan,
		handleRemoveLocation,
	};
};
