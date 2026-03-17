import { useState } from "react";
import {
	LocationData,
	addLocationToTripPlan,
	clearRecommendationCache,
} from "../../services/RecommendationService";
import { getTranslatedName } from "../../utils/translate";
import { FaMapMarkerAlt, FaTag, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type RecommendationCardProps = {
	location: LocationData;
	onAddedToPlan: (planId: number) => void;
};

const RecommendationCard = ({
	location,
	onAddedToPlan,
}: RecommendationCardProps) => {
	const { t, i18n } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);
	const [isAdded, setIsAdded] = useState(location.is_in_trip);

	const translatedDescription = getTranslatedName(
		location,
		i18n,
		"description",
	);
	const translatedName = getTranslatedName(location, i18n, "name");
	const translatedCity = getTranslatedName(location.city, i18n, "name");
	const translatedCategory = location.category
		? getTranslatedName(location.category, i18n, "name")
		: "";

	const handleAddLocation = async () => {
		if (isLoading || isAdded) return;

		try {
			setIsLoading(true);
			const response = await addLocationToTripPlan(location.city.id, location.id);
			onAddedToPlan(response.trip_plan_id);
			clearRecommendationCache();
			setIsAdded(true);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="group relative bg-(--color-bg-nav-footer) border border-(--color-primary)/10 rounded-3xl overflow-hidden hover:border-(--color-primary)/40 transition-all duration-500 hover:-translate-y-2 shadow-xl flex flex-col h-full">
			<div className="h-48 bg-linear-to-br from-gray-800 to-gray-900 relative flex items-center justify-center overflow-hidden">
				<FaTag className="text-white/10" size={80} />

				<div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">
					{translatedCategory}
				</div>
			</div>

			<div className="p-6 flex flex-col flex-1">
				<div className="mb-4">
					<h3 className="text-xl font-bold text-(--color-text) group-hover:text-(--color-primary) transition-colors line-clamp-1">
						{translatedName}
					</h3>
					<div className="flex items-center gap-2 text-(--color-text)/50 text-sm mt-2">
						<FaMapMarkerAlt className="text-(--color-primary)" />
						<span className="truncate">{translatedCity}</span>
					</div>
				</div>

				<p className="text-(--color-text)/60 text-sm line-clamp-3 mb-6 flex-1">
					{translatedDescription}
				</p>

				<button
					onClick={handleAddLocation}
					disabled={isLoading || isAdded}
					className={`mt-auto group/btn flex items-center justify-center gap-2 w-full py-3 rounded-2xl transition-all duration-300 active:scale-95 border 
          ${
				isAdded
					? "bg-green-500/10 text-green-500 border-green-500/20 cursor-default"
					: "bg-(--color-primary)/10 text-(--color-primary) border-(--color-primary)/20 hover:bg-(--color-primary) hover:text-white"
			} 
          disabled:opacity-80`}
				>
					<span>
						{isLoading
							? t("recommendations.adding")
							: isAdded
								? t("recommendations.added")
								: t("recommendations.add")}
					</span>

					{isAdded ? (
						<span className="text-lg">✓</span>
					) : (
						<FaPlus
							size={14}
							className="group-hover/btn:rotate-90 transition-transform duration-300"
						/>
					)}
				</button>
			</div>
		</div>
	);
};

export default RecommendationCard;
