import { useTranslation } from "react-i18next";
import { FaRegClock, FaPlug, FaBan, FaGlobeEurope } from "react-icons/fa";

const features = [
	{ icon: FaRegClock, titleKey: "personalization" },
	{ icon: FaPlug, titleKey: "integration" },
	{ icon: FaBan, titleKey: "aggregators" },
	{ icon: FaGlobeEurope, titleKey: "culture" },
];

const Features = () => {
	const { t } = useTranslation();

	return (
		<section className="py-12 px-4 mb-12 md:mb-24 text-(--color-text)">
			<h2 className="text-lg md:text-3xl font-bold text-center mb-10 ">
				{t("features.title")}
			</h2>
			<div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{features.map(({ icon: Icon, titleKey }, index) => (
					<div
						key={index}
						className="flex flex-col items-center text-center py-3 px-4 rounded-2xl shadow-sm 
						hover:shadow-md hover:-translate-y-1 transition-all duration-300
						h-35 sm:h-40 md:h-40 justify-center bg-(--color-bg-nav-footer) group"
					>
						<Icon
							size={28}
							className="text-(--color-primary) group-hover:text-(--color-primary-hover) transition-colors duration-300"
						/>
						<p
							className="mt-4 text-xs sm:text-sm md:text-base font-medium text-(--color-text) 
						group-hover:text-(--color-primary-hover) transition-colors duration-300"
						>
							{t(`features.${titleKey}`)}
						</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default Features;
