import { useCallback, useEffect, useState } from "react";
import { getMyPlans, TripPlan } from "../services/TripPlanService";

type UsePlansReturn = {
	plans: TripPlan[];
	loading: boolean;
	error: string;
	refetchPlans: () => Promise<void>;
};

/**
 * Hook for fetching and managing user's trip plans
 * Provides API data, UI states, and refetch capability
 */

export const usePlans = (): UsePlansReturn => {
	const [plans, setPlans] = useState<TripPlan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchPlans = useCallback(async () => {
		try {
			setLoading(true);
			setError("");
			const data = await getMyPlans();
			setPlans(data);
		} catch (err) {
			console.error(err);
			setError("plans.error");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPlans();
	}, [fetchPlans]);

	return {
		plans,
		loading,
		error,
		refetchPlans: fetchPlans,
	};
};
