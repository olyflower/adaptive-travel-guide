import React from "react";
import { useTranslation } from "react-i18next";
import { FaRegClock, FaPlug, FaBan, FaGlobeEurope } from "react-icons/fa";

const features = [
	{ icon: FaRegClock, titleKey: "personalization" },
	{ icon: FaPlug, titleKey: "integration" },
	{ icon: FaBan, titleKey: "aggregators" },
	{ icon: FaGlobeEurope, titleKey: "culture" },
];

const Features: React.FC = () => {
	const { t } = useTranslation();

	return (
		<section className="py-12 px-4">
			<h2 className="md:text-xl font-bold text-center mb-10 ">
				{t("features.title")}
			</h2>
			<div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{features.map(({ icon: Icon, titleKey }, index) => (
					<div
						key={index}
						className="flex flex-col items-center text-center py-3 px-4 bg-[var(--color-bg)] rounded-2xl shadow hover:shadow-md transition h-[140px] sm:h-[160px] md:h-[160px] justify-center"
					>
						<Icon
							size={28}
							className="text-[var(--color-purple)] hover:text-[var(--color-purple-hover)]"
						/>
						<p className="mt-4 text-xs sm:text-sm md:text-base font-medium">
							{t(`features.${titleKey}`)}
						</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default Features;
