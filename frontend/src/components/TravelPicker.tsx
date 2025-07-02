import React from "react";
import { useTranslation } from "react-i18next";
import gourmetImg from "../assets/gourmet.png";
import urbanistImg from "../assets/urban.png";
import natureImg from "../assets/nature.png";
import artistImg from "../assets/artist.png";
import styleImg from "../assets/style.png";

const travelStyles = [
	{ image: gourmetImg, titleKey: "gourmet" },
	{ image: urbanistImg, titleKey: "urban" },
	{ image: natureImg, titleKey: "nature" },
	{ image: artistImg, titleKey: "artist" },
	{ image: styleImg, titleKey: "style" },
];

const TravelStylePicker: React.FC = () => {
	const { t } = useTranslation();

	return (
		<section className="w-full max-w-6xl mx-auto px-4 py-12">
			<h2 className="text-2xl font-bold text-center mb-10">
				{t("travel_picker.title")}
			</h2>

			{/* Desktop Carousel */}
			<div className="hidden sm:flex gap-6 overflow-x-auto scrollbar-hide px-2">
				{travelStyles.map(({ image, titleKey }, index) => (
					<div key={index} className="flex-shrink-0 w-96 text-center">
						<div className="text-lg font-semibold mb-3">
							{t(`travel_picker.${titleKey}`)}
						</div>
						<img
							src={image}
							alt={t(`travel_picker.${titleKey}`)}
							className="w-96 h-60 object-cover rounded-2xl shadow-lg transition-transform hover:scale-100"
						/>
					</div>
				))}
			</div>

			{/* Mobile Carousel */}
			<div className="sm:hidden mt-8">
				<div className="flex gap-4 overflow-x-auto scrollbar-hide px-2">
					{travelStyles.map(({ image, titleKey }, index) => (
						<div
							key={index}
							className="flex-shrink-0 w-60 text-center"
						>
							<div className="text-sm mb-2">
								{t(`travel_picker.${titleKey}`)}
							</div>
							<img
								src={image}
								alt={t(`travel_picker.${titleKey}`)}
								className="w-60 h-40 object-cover rounded-xl shadow"
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TravelStylePicker;
