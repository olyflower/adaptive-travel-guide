import { useCallback, useEffect, useState } from "react";
import { getMyPlans, TripPlan } from "../services/TripPlanService";

type UsePlansReturn = {
	plans: TripPlan[];
	loading: boolean;
	error: string | null;
	refetchPlans: () => Promise<void>;
};

/**
 * Hook for fetching and managing the current user's trip plans.
 *
 * Returns:
 * - plans data
 * - loading state
 * - error state
 * - manual refetch handler
 */

export const usePlans = (): UsePlansReturn => {
	const [plans, setPlans] = useState<TripPlan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPlans = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

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
		let isActive = true;

		const loadPlans = async () => {
			try {
				setLoading(true);
				setError(null);

				const data = await getMyPlans();

				if (!isActive) return;
				setPlans(data);
			} catch (err) {
				if (!isActive) return;
				console.error(err);
				setError("plans.error");
			} finally {
				if (isActive) {
					setLoading(false);
				}
			}
		};

		loadPlans();

		return () => {
			isActive = false;
		};
	}, []);

	return {
		plans,
		loading,
		error,
		refetchPlans: fetchPlans,
	};
};
