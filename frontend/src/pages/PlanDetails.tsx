import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTranslatedName } from "../utils/translate";
import { usePlanDetails } from "../hooks/usePlanDetails";
import TripDatesForm from "../components/TripDatesForm";
import PlanLocationsMap from "../components/PlanLocationsMap";
import {
	FaArrowLeft,
	FaCalendarAlt,
	FaMapMarkerAlt,
	FaLanguage,
	FaCloudSun,
	FaCoins,
	FaTrash,
} from "react-icons/fa";

const PlanDetails = () => {
	const { id } = useParams<{ id: string }>();
	const { t, i18n } = useTranslation();
	const [isEditingDates, setIsEditingDates] = useState(false);

	const {
		plan,
		travelInfo,
		route,
		isGeneratingRoute,
		loading,
		isDeleting,
		isUpdatingDates,
		error,
		actionError,
		handleDeletePlan,
		handleRemoveLocation,
		handleUpdateDates,
		handleGenerateRoute,
	} = usePlanDetails(id);

	if (loading) {
		return (
			<div className="max-w-3xl mx-auto p-6 pt-32 min-h-screen">
				<div className="rounded-2xl border border-(--color-primary)/10 bg-(--color-primary)/5 p-6 text-center text-(--color-text)">
					<p className="text-lg font-medium">{t("plans.loading")}</p>
				</div>
			</div>
		);
	}
	if (error) {
		return (
			<div className="max-w-3xl mx-auto p-6 pt-32 min-h-screen">
				<div className="rounded-2xl border border-(--color-red)/20 bg-(--color-red)/10 p-6 text-center text-(--color-red)">
					<p className="text-lg font-medium">{error}</p>
					<Link
						to="/plans"
						className="inline-block mt-4 text-(--color-primary) hover:underline"
					>
						{t("plans.back_to_list")}
					</Link>
				</div>
			</div>
		);
	}

	if (!plan) {
		return (
			<div className="max-w-3xl mx-auto p-6 pt-32 min-h-screen">
				<div className="rounded-2xl border border-(--color-red)/20 bg-(--color-red)/10 p-6 text-center text-(--color-red)">
					<p className="text-lg font-medium">
						{t("plans.not_found")}
					</p>
					<Link
						to="/plans"
						className="inline-block mt-4 text-(--color-primary) hover:underline"
					>
						{t("plans.back_to_list")}
					</Link>
				</div>
			</div>
		);
	}
	const formatDateRange = (
		startDate: string | null,
		endDate: string | null,
	) => {
		if (startDate && endDate) return `${startDate} — ${endDate}`;
		if (startDate) return `${t("plans.from")} ${startDate}`;
		if (endDate) return `${t("plans.until")} ${endDate}`;
		return t("plans.dates_not_set");
	};
	const cityName = getTranslatedName(plan.city, i18n, "name");

	return (
		<div className="max-w-7xl mx-auto px-6 py-16 md:py-28 min-h-screen">
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
			{actionError && (
				<div className="mb-6 rounded-2xl border border-(--color-red)/20 bg-(--color-red)/10 p-4 text-(--color-red)">
					{actionError}
				</div>
			)}

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
								{formatDateRange(
									plan.start_date,
									plan.end_date,
								)}
							</span>
							<span className="flex items-center gap-2">
								<FaMapMarkerAlt className="text-(--color-primary)" />
								{plan.city.country_code}
							</span>
						</div>
						<div className="mt-4">
							{isEditingDates ? (
								<TripDatesForm
									initialStartDate={plan.start_date}
									initialEndDate={plan.end_date}
									isSaving={isUpdatingDates}
									onSave={async (startDate, endDate) => {
										const success = await handleUpdateDates(
											startDate,
											endDate,
										);
										if (success) {
											setIsEditingDates(false);
										}
									}}
									onCancel={() => setIsEditingDates(false)}
								/>
							) : (
								<button
									type="button"
									onClick={() => setIsEditingDates(true)}
									className="px-4 py-2 rounded-xl border border-(--color-primary) text-(--color-primary) 
									hover:bg-(--color-primary) hover:text-white transition"
								>
									{plan.start_date || plan.end_date
										? t("plans.edit_dates")
										: t("plans.add_dates")}
								</button>
							)}
						</div>
					</div>

					<section>
						<h2 className="text-2xl font-bold text-(--color-text) mb-6 border-l-4 border-(--color-primary) pl-4">
							{t("plans.places")}
						</h2>
						{plan.recommendations.length > 0 ? (
							<div className="space-y-4">
								{plan.recommendations.map((rec) => (
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
						<section className="mt-10">
							<h2 className="text-2xl font-bold text-(--color-text) mb-6 border-l-4 border-(--color-primary) pl-4">
								{t("plans.map")}
							</h2>
							<div className="mb-4">
								<button
									type="button"
									onClick={handleGenerateRoute}
									disabled={isGeneratingRoute}
									className="px-4 py-2 rounded-xl bg-(--color-primary) text-white"
								>
									{isGeneratingRoute
										? t("plans.building_route")
										: t("plans.build_route")}
								</button>
							</div>
							<PlanLocationsMap
								recommendations={plan.recommendations}
								route={route}
							/>
						</section>
					</section>
				</div>

				<div className="space-y-6">
					<div className="bg-(--color-primary)/5 border border-(--color-primary)/10 p-6 rounded-3xl">
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

					<div className="bg-(--color-primary)/5 border border-(--color-primary)/10 p-6 rounded-3xl">
						<h3 className="font-bold flex items-center gap-2 mb-4 text-(--color-primary) uppercase tracking-wider text-sm">
							<FaCoins size={18} /> {t("plans.currency")}
						</h3>

						<div className="text-(--color-text)">
							{travelInfo?.currency ? (
								travelInfo.currency.from ===
								travelInfo.currency.to ? (
									<div>
										<p className="text-sm pb-2">
											{t("plans.same_currency")}
										</p>
										<p className="text-sm opacity-70">
											{`1 ${travelInfo.currency.from} = 1 ${travelInfo.currency.to}`}
										</p>
									</div>
								) : (
									<p className="text-xl font-bold">
										{`1 ${travelInfo.currency.from} = ${travelInfo.currency.rate} ${travelInfo.currency.to}`}
									</p>
								)
							) : (
								<p className="text-sm opacity-60">
									{t("plans.loading")}
								</p>
							)}
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

export default PlanDetails;
