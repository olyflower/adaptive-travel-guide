// import { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import {
// 	getPlanDetails,
// 	deletePlan,
// 	removeRecommendationFromPlan,
// 	getCityTravelInfo,
// 	TripPlan,
// 	TravelInfo,
// } from "../services/TripPlanService";
// import { clearRecommendationCache } from "../services/RecommendationService";
// import { useTranslation } from "react-i18next";
// import { getTranslatedName } from "../utils/translate";
// import {
// 	FaArrowLeft,
// 	FaCalendarAlt,
// 	FaMapMarkerAlt,
// 	FaLanguage,
// 	FaCloudSun,
// 	FaCoins,
// 	FaTrash,
// } from "react-icons/fa";

// const TripPlanDetail = () => {
// 	const { id } = useParams<{ id: string }>();
// 	const navigate = useNavigate();
// 	const { t, i18n } = useTranslation();

// 	const [plan, setPlan] = useState<TripPlan | null>(null);
// 	const [loading, setLoading] = useState(true);
// 	const [isDeleting, setIsDeleting] = useState(false);
// 	const [travelInfo, setTravelInfo] = useState<TravelInfo | null>(null);

// 	useEffect(() => {
// 		if (id) {
// 			getPlanDetails(id)
// 				.then(setPlan)
// 				.catch((err) => console.error(err))
// 				.finally(() => setLoading(false));
// 		}
// 	}, [id]);

// 	const handleDeletePlan = async () => {
// 		if (!id || isDeleting) return;

// 		try {
// 			setIsDeleting(true);
// 			await deletePlan(id);
// 			navigate("/plans");
// 		} catch (err) {
// 			console.error(err);
// 		} finally {
// 			setIsDeleting(false);
// 		}
// 	};

// 	useEffect(() => {
// 		if (!plan?.city?.id) return;

// 		const loadTravelInfo = async () => {
// 			try {
// 				const data = await getCityTravelInfo(plan.city.id);
// 				setTravelInfo(data);
// 			} catch (err: unknown) {
// 				console.error(err);
// 			}
// 		};

// 		loadTravelInfo();
// 	}, [plan]);

// 	if (loading) {
// 		return (
// 			<div className="pt-40 text-center text-(--color-text)">
// 				{t("plans.loading")}
// 			</div>
// 		);
// 	}

// 	if (!plan) {
// 		return (
// 			<div className="pt-40 text-center text-(--color-red)">
// 				{t("plans.not_found")}
// 			</div>
// 		);
// 	}

// 	const handleRemoveLocation = async (recommendationId: number) => {
// 		try {
// 			await removeRecommendationFromPlan(recommendationId);

// 			setPlan((prev) =>
// 				prev
// 					? {
// 							...prev,
// 							recommendations: prev.recommendations.filter(
// 								(rec) => rec.id !== recommendationId,
// 							),
// 						}
// 					: prev,
// 			);
// 			clearRecommendationCache();
// 		} catch (err: unknown) {
// 			console.error(err);
// 		}
// 	};

// 	const cityName = getTranslatedName(plan.city, i18n, "name");

// 	return (
// 		<div className="max-w-7xl mx-auto p-6 pt-32 min-h-screen">
// 			<div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
// 				<Link
// 					to="/plans"
// 					className="flex items-center gap-2 text-(--color-primary) hover:underline"
// 				>
// 					<FaArrowLeft /> {t("plans.back_to_list")}
// 				</Link>

// 				<button
// 					type="button"
// 					onClick={handleDeletePlan}
// 					disabled={isDeleting}
// 					className="px-5 py-2 rounded-xl border border-(--color-primary) text-(--color-primary)
// 					hover:bg-(--color-red) hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
// 				>
// 					{isDeleting ? t("plans.deleting") : t("plans.delete_plan")}
// 				</button>
// 			</div>

// 			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
// 				<div className="lg:col-span-2">
// 					<div className="mb-10">
// 						<h1 className="text-4xl md:text-6xl font-bold text-(--color-text) mb-4">
// 							{t("plans.trip_to")}{" "}
// 							<span className="text-(--color-primary)">
// 								{cityName}
// 							</span>
// 						</h1>
// 						<div className="flex flex-wrap gap-4 text-(--color-text) opacity-70">
// 							<span className="flex items-center gap-2">
// 								<FaCalendarAlt className="text-(--color-primary)" />
// 								{plan.start_date && plan.end_date
// 									? `${plan.start_date} — ${plan.end_date}`
// 									: t("plans.dates_not_set")}
// 							</span>
// 							<span className="flex items-center gap-2">
// 								<FaMapMarkerAlt className="text-(--color-primary)" />
// 								{plan.city.country_code}
// 							</span>
// 						</div>
// 					</div>

// 					<section>
// 						<h2 className="text-2xl font-bold text-(--color-text) mb-6 border-l-4 border-(--color-primary) pl-4">
// 							{t("plans.places")}
// 						</h2>
// 						{plan.recommendations.length > 0 ? (
// 							<div className="space-y-4">
// 								{plan.recommendations.map((rec: any) => (
// 									<div
// 										key={rec.id}
// 										className="bg-(--color-bg-nav-footer) p-6 rounded-3xl border border-(--color-primary)/10 shadow-sm"
// 									>
// 										<div className="flex items-start justify-between gap-4">
// 											<div className="flex-1">
// 												<h3 className="text-xl font-bold text-(--color-text) mb-2">
// 													{getTranslatedName(
// 														rec.location,
// 														i18n,
// 														"name",
// 													)}
// 												</h3>
// 												<p className="text-sm text-(--color-text) opacity-70">
// 													{getTranslatedName(
// 														rec.location,
// 														i18n,
// 														"description",
// 													)}
// 												</p>
// 											</div>

// 											<button
// 												type="button"
// 												onClick={() =>
// 													handleRemoveLocation(rec.id)
// 												}
// 												className="p-3 rounded-xl border border-(--color-primary) text-(--color-primary)
// 												hover:bg-(--color-red) hover:text-white transition"
// 												aria-label={t(
// 													"plans.remove_location",
// 												)}
// 												title={t(
// 													"plans.remove_location",
// 												)}
// 											>
// 												<FaTrash />
// 											</button>
// 										</div>
// 									</div>
// 								))}
// 							</div>
// 						) : (
// 							<div className="p-10 border border-dashed border-(--color-border) rounded-3xl text-center">
// 								<h3 className="text-xl font-semibold text-(--color-text) mb-3">
// 									{t("plans.no_locations")}
// 								</h3>
// 								<p className="text-(--color-text) opacity-60 mb-6">
// 									{t("plans.no_locations_hint")}
// 								</p>
// 								<Link
// 									to={`/recommendations?city=${encodeURIComponent(plan.city.name)}`}
// 									className="inline-block px-6 py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90 transition"
// 								>
// 									{t("plans.find_recommendations")}
// 								</Link>
// 							</div>
// 						)}
// 					</section>
// 				</div>

// 				<div className="space-y-6">
// 					<div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl">
// 						<h3 className="font-bold flex items-center gap-2 mb-4 text-(--color-primary) uppercase tracking-wider text-sm">
// 							<FaCloudSun size={18} /> {t("plans.weather_live")}{" "}
// 							<span className="text-(--color-primary)">
// 								{cityName}
// 							</span>
// 						</h3>
// 						<div className="flex items-center justify-between">
// 							<div>
// 								<p className="text-3xl font-bold text-(--color-text)">
// 									{travelInfo?.weather
// 										? `${Math.round(travelInfo.weather.temperature)}°C`
// 										: "--"}
// 								</p>
// 								<p className="text-sm opacity-60 text-(--color-text)">
// 									{travelInfo?.weather?.city ||
// 										t("plans.loading")}
// 								</p>
// 							</div>
// 							<FaCloudSun
// 								size={40}
// 								className="text-(--color-primary)"
// 							/>
// 						</div>
// 					</div>

// 					<div className="bg-green-500/5 border border-green-500/10 p-6 rounded-3xl">
// 						<h3 className="font-bold flex items-center gap-2 mb-4 text-(--color-primary) uppercase tracking-wider text-sm">
// 							<FaCoins size={18} /> {t("plans.currency")}
// 						</h3>
// 						<div className="text-(--color-text)">
// 							<p className="text-xl font-bold">
// 								{travelInfo?.currency
// 									? `1 ${travelInfo.currency.from} = ${travelInfo.currency.rate} ${travelInfo.currency.to}`
// 									: "--"}
// 							</p>
// 						</div>
// 					</div>

// 					<div className="bg-(--color-primary)/5 border border-(--color-primary)/10 p-6 rounded-3xl">
// 						<h3 className="font-bold flex items-center gap-2 mb-6 text-(--color-primary) uppercase tracking-wider text-sm">
// 							<FaLanguage size={22} />{" "}
// 							{t("plans.essential_phrases")}
// 						</h3>
// 						<div className="space-y-4">
// 							{plan.phrases.length > 0 ? (
// 								plan.phrases.map((phrase, idx) => (
// 									<div
// 										key={idx}
// 										className="group border-b border-(--color-primary)/5 pb-3 last:border-0"
// 									>
// 										<p className="font-bold text-(--color-text) group-hover:text-(--color-primary) transition-colors">
// 											{phrase.phrase_origin}
// 										</p>
// 										<p className="text-sm opacity-60 text-(--color-text) italic">
// 											{phrase.phrase_translation}
// 										</p>
// 									</div>
// 								))
// 							) : (
// 								<p className="text-xs opacity-50 italic">
// 									{t("plans.no_phrases")}
// 								</p>
// 							)}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default TripPlanDetail;

import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTranslatedName } from "../utils/translate";
import { usePlanDetails } from "../hooks/usePlanDetails";
import {
	FaArrowLeft,
	FaCalendarAlt,
	FaMapMarkerAlt,
	FaLanguage,
	FaCloudSun,
	FaCoins,
	FaTrash,
} from "react-icons/fa";

const TripPlanDetail = () => {
	const { id } = useParams<{ id: string }>();
	const { t, i18n } = useTranslation();

	const {
		plan,
		travelInfo,
		loading,
		isDeleting,
		handleDeletePlan,
		handleRemoveLocation,
	} = usePlanDetails(id);

	if (loading) {
		return (
			<div className="pt-40 text-center text-(--color-text)">
				{t("plans.loading")}
			</div>
		);
	}

	if (!plan) {
		return (
			<div className="pt-40 text-center text-(--color-red)">
				{t("plans.not_found")}
			</div>
		);
	}

	const cityName = getTranslatedName(plan.city, i18n, "name");

	return (
		<div className="max-w-7xl mx-auto p-6 pt-32 min-h-screen">
			<div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
				<Link
					to="/plans"
					className="flex items-center gap-2 text-(--color-primary) hover:underline"
				>
					<FaArrowLeft /> {t("plans.back_to_list")}
				</Link>

				<button
					type="button"
					onClick={handleDeletePlan}
					disabled={isDeleting}
					className="px-5 py-2 rounded-xl border border-(--color-primary) text-(--color-primary) 
					hover:bg-(--color-red) hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isDeleting ? t("plans.deleting") : t("plans.delete_plan")}
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
				<div className="lg:col-span-2">
					<div className="mb-10">
						<h1 className="text-4xl md:text-6xl font-bold text-(--color-text) mb-4">
							{t("plans.trip_to")}{" "}
							<span className="text-(--color-primary)">
								{cityName}
							</span>
						</h1>
						<div className="flex flex-wrap gap-4 text-(--color-text) opacity-70">
							<span className="flex items-center gap-2">
								<FaCalendarAlt className="text-(--color-primary)" />
								{plan.start_date && plan.end_date
									? `${plan.start_date} — ${plan.end_date}`
									: t("plans.dates_not_set")}
							</span>
							<span className="flex items-center gap-2">
								<FaMapMarkerAlt className="text-(--color-primary)" />
								{plan.city.country_code}
							</span>
						</div>
					</div>

					<section>
						<h2 className="text-2xl font-bold text-(--color-text) mb-6 border-l-4 border-(--color-primary) pl-4">
							{t("plans.places")}
						</h2>
						{plan.recommendations.length > 0 ? (
							<div className="space-y-4">
								{plan.recommendations.map((rec: any) => (
									<div
										key={rec.id}
										className="bg-(--color-bg-nav-footer) p-6 rounded-3xl border border-(--color-primary)/10 shadow-sm"
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<h3 className="text-xl font-bold text-(--color-text) mb-2">
													{getTranslatedName(
														rec.location,
														i18n,
														"name",
													)}
												</h3>
												<p className="text-sm text-(--color-text) opacity-70">
													{getTranslatedName(
														rec.location,
														i18n,
														"description",
													)}
												</p>
											</div>

											<button
												type="button"
												onClick={() =>
													handleRemoveLocation(rec.id)
												}
												className="p-3 rounded-xl border border-(--color-primary) text-(--color-primary) 
												hover:bg-(--color-red) hover:text-white transition"
												aria-label={t(
													"plans.remove_location",
												)}
												title={t(
													"plans.remove_location",
												)}
											>
												<FaTrash />
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="p-10 border border-dashed border-(--color-border) rounded-3xl text-center">
								<h3 className="text-xl font-semibold text-(--color-text) mb-3">
									{t("plans.no_locations")}
								</h3>
								<p className="text-(--color-text) opacity-60 mb-6">
									{t("plans.no_locations_hint")}
								</p>
								<Link
									to={`/recommendations?city=${encodeURIComponent(plan.city.name)}`}
									className="inline-block px-6 py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90 transition"
								>
									{t("plans.find_recommendations")}
								</Link>
							</div>
						)}
					</section>
				</div>

				<div className="space-y-6">
					<div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl">
						<h3 className="font-bold flex items-center gap-2 mb-4 text-(--color-primary) uppercase tracking-wider text-sm">
							<FaCloudSun size={18} /> {t("plans.weather_live")}{" "}
							<span className="text-(--color-primary)">
								{cityName}
							</span>
						</h3>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-3xl font-bold text-(--color-text)">
									{travelInfo?.weather
										? `${Math.round(travelInfo.weather.temperature)}°C`
										: "--"}
								</p>
								<p className="text-sm opacity-60 text-(--color-text)">
									{travelInfo?.weather?.city ||
										t("plans.loading")}
								</p>
							</div>
							<FaCloudSun
								size={40}
								className="text-(--color-primary)"
							/>
						</div>
					</div>

					<div className="bg-green-500/5 border border-green-500/10 p-6 rounded-3xl">
						<h3 className="font-bold flex items-center gap-2 mb-4 text-(--color-primary) uppercase tracking-wider text-sm">
							<FaCoins size={18} /> {t("plans.currency")}
						</h3>
						<div className="text-(--color-text)">
							<p className="text-xl font-bold">
								{travelInfo?.currency
									? `1 ${travelInfo.currency.from} = ${travelInfo.currency.rate} ${travelInfo.currency.to}`
									: "--"}
							</p>
						</div>
					</div>

					<div className="bg-(--color-primary)/5 border border-(--color-primary)/10 p-6 rounded-3xl">
						<h3 className="font-bold flex items-center gap-2 mb-6 text-(--color-primary) uppercase tracking-wider text-sm">
							<FaLanguage size={22} />{" "}
							{t("plans.essential_phrases")}
						</h3>
						<div className="space-y-4">
							{plan.phrases.length > 0 ? (
								plan.phrases.map((phrase, idx) => (
									<div
										key={idx}
										className="group border-b border-(--color-primary)/5 pb-3 last:border-0"
									>
										<p className="font-bold text-(--color-text) group-hover:text-(--color-primary) transition-colors">
											{phrase.phrase_origin}
										</p>
										<p className="text-sm opacity-60 text-(--color-text) italic">
											{phrase.phrase_translation}
										</p>
									</div>
								))
							) : (
								<p className="text-xs opacity-50 italic">
									{t("plans.no_phrases")}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TripPlanDetail;
