import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getTranslatedName } from "../utils/translate";
import { usePlans } from "../hooks/usePlans";

const Plans = () => {
	const { t, i18n } = useTranslation();
	const { plans, loading, error } = usePlans();

	if (loading) {
		return (
			<div className="pt-32 text-center text-(--color-text)">
				{t("plans.loading")}
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6 pt-32 min-h-screen">
			<h1 className="text-4xl font-bold text-(--color-text) mb-8">
				{t("plans.my_trips")}
			</h1>

			{error && (
				<div
					className="bg-(--color-red)/10 border border-(--color-red)/20 text-(--color-red) 
				p-6 rounded-2xl text-center"
				>
					<p className="text-lg font-medium">{t(error)}</p>
				</div>
			)}

			{!error && plans.length === 0 && (
				<div className="rounded-2xl border border-dashed border-(--color-border) p-10 text-center bg-white/40">
					<h2 className="text-2xl font-semibold mb-3 text-(--color-text)">
						{t("plans.empty_title")}
					</h2>
					<p className="text-(--color-text) opacity-60 max-w-2xl mx-auto">
						{t("plans.empty_text")}
					</p>
				</div>
			)}

			{!error && plans.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{plans.map((plan) => (
						<Link
							key={plan.id}
							to={`/plans/${plan.id}`}
							className="bg-(--color-bg-nav-footer) border border-(--color-primary)/10 p-6 rounded-3xl 
							hover:border-(--color-primary) transition-all shadow-lg"
						>
							<div className="flex items-center gap-2 text-(--color-primary)">
								<FaMapMarkerAlt className="text-lg" />
								<h2 className="text-2xl font-bold">
									{getTranslatedName(plan.city, i18n, "name")}
								</h2>
							</div>

							<p className="text-sm opacity-60 mt-2">
								{plan.start_date && plan.end_date
									? `${plan.start_date} — ${plan.end_date}`
									: t("plans.dates_not_set")}
							</p>

							<div className="mt-4 text-sm font-medium text-(--color-text)">
								{plan.recommendations.length}{" "}
								{t("plans.locations")}
							</div>

							<div className="mt-6 text-sm text-(--color-primary) font-medium">
								{t("plans.open_plan")}
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default Plans;
