import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
	loadRecommendations,
	LocationData,
} from "../../services/RecommendationService";
import RecommendationCard from "./RecommendationCard";
import { getTranslatedName } from "../../utils/translate";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa";

const RecommendationPage = () => {
	const { t, i18n } = useTranslation();
	const [searchParams] = useSearchParams();
	const [recommendations, setRecommendations] = useState<LocationData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const cityQuery = searchParams.get("city") || "";

	const cityName = recommendations[0]?.city
		? getTranslatedName(recommendations[0].city, i18n, "name")
		: cityQuery;

	useEffect(() => {
		const load = async () => {
			if (!cityQuery) {
				setError("City not specified");
				setLoading(false);
				return;
			}

			setLoading(true);
			setError("");

			try {
				const data = await loadRecommendations(cityQuery);

				if (data.length === 0) {
					setError(
						"No recommendations found for this city. Try another one!",
					);
				}
				setRecommendations(data);
			} catch (err: any) {
				if (err.message === "PROFILE_INCOMPLETE") {
					setError(
						"Please fill your profile preferences to get AI recommendations.",
					);
				} else {
					setError(
						"Error loading recommendations. Please try again later.",
					);
				}
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [cityQuery, i18n.language]);

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

			<h1 className="text-3xl md:text-5xl font-bold mb-2 text-(--color-text)">
				{t("recommendations.title")}{" "}
				<span className="text-(--color-primary)">{cityName}</span>
			</h1>
			<p className="text-(--color-text) opacity-60 mb-8 italic">
				{t("recommendations.subtitle")}
			</p>

			{loading && (
				<div className="flex justify-center py-20">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-(--color-primary)"></div>
				</div>
			)}

			{error && (
				<div className="bg-(--color-red)/10 border border-(--color-red)/20 text-(--color-red) p-6 rounded-2xl text-center">
					<p className="text-lg font-medium">{error}</p>
					{error.includes("profile") && (
						<Link
							to="/profile"
							className="btn-primary inline-block mt-4 px-6 py-2 rounded-xl bg-(--color-primary) text-white"
						>
							Go to Profile
						</Link>
					)}
				</div>
			)}

			{!loading && !error && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{recommendations.map((loc) => (
						<RecommendationCard key={loc.id} location={loc} />
					))}
				</div>
			)}
		</div>
	);
};

export default RecommendationPage;
