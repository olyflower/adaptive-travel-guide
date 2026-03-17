import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
	loadRecommendations,
	LocationData,
	CityData,
} from "../../services/RecommendationService";
import RecommendationCard from "./RecommendationCard";
import { getTranslatedName } from "../../utils/translate";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa";

const RecommendationsPage = () => {
	const { t, i18n } = useTranslation();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [city, setCity] = useState<CityData | null>(null);
	const [recommendations, setRecommendations] = useState<LocationData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
	const [tripPlanId, setTripPlanId] = useState<number | null>(null);

	const cityQuery = searchParams.get("city") || "";
	const cityName = city ? getTranslatedName(city, i18n, "name") : cityQuery;

	useEffect(() => {
		const load = async () => {
			if (!cityQuery) {
				setError("recommendations.city_not_specified");
				setLoading(false);
				return;
			}

			setLoading(true);
			setError("");
			setIsProfileIncomplete(false);

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
							break;
						default:
							setError("recommendations.error_general");
					}
				} else {
					setError("recommendations.error_general");
				}
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [cityQuery, navigate]);
	return (
		<div className="max-w-7xl mx-auto p-6 pt-32 min-h-screen">
			<div className="flex items-center gap-4 mb-8">
				<Link
					to="/"
					className="text-(--color-primary) hover:underline flex items-center gap-2"
				>
					<FaArrowLeft /> {t("not_found.return_home")}
				</Link>
			</div>

			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
				<h1 className="text-3xl md:text-5xl font-bold text-(--color-text)">
					{t("recommendations.title")}{" "}
					<span className="text-(--color-primary)">{cityName}</span>
				</h1>

				<Link
					to="/plans"
					className="bg-(--color-primary) text-white px-5 py-2 rounded-xl hover:opacity-90 transition"
				>
					{t("recommendations.plan")}
				</Link>
			</div>
			<p className="text-(--color-text) opacity-60 mb-8 italic">
				{t("recommendations.subtitle")}
			</p>

			{!loading && error && (
				<div className="bg-(--color-red)/10 border border-(--color-red)/20 text-(--color-red) p-6 rounded-2xl text-center">
					<p className="text-lg font-medium">{t(error)}</p>

					{isProfileIncomplete && (
						<Link
							to="/profile"
							className="btn-primary inline-block mt-4 px-6 py-2 rounded-xl bg-(--color-primary) text-white"
						>
							{t("recommendations.go_to_profile")}
						</Link>
					)}
				</div>
			)}

			{!loading && !error && recommendations.length === 0 && (
				<div className="bg-(--color-primary)/5 border border-(--color-primary)/20 p-6 rounded-2xl text-center">
					<p className="text-lg font-medium text-(--color-text)">
						{t("recommendations.empty")}
					</p>
				</div>
			)}

			{!loading && !error && recommendations.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{recommendations.map((loc) => (
						<RecommendationCard
							key={loc.id}
							location={loc}
							onAddedToPlan={(planId) => setTripPlanId(planId)}
						/>
					))}
				</div>
			)}
			{!loading && !error && recommendations.length > 0 && tripPlanId && (
				<div className="mt-10 flex justify-center">
					<Link
						to={`/plans/${tripPlanId}`}
						className="px-6 py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90 transition"
					>
						{t("plans.go_to_plan")}
					</Link>
				</div>
			)}
		</div>
	);
};

export default RecommendationsPage;
