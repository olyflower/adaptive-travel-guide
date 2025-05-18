import React from "react";
import { FaRegClock, FaPlug, FaBan, FaGlobeEurope } from "react-icons/fa";

const features = [
	{
		icon: <FaRegClock size={28} className="text-[#4A1158]" />,
		title: "Персоналізація 24/7",
	},
	{
		icon: <FaPlug size={28} className="text-[#4A1158]" />,
		title: "Інтеграція з реальними сервісами",
	},
	{
		icon: <FaBan size={28} className="text-[#4A1158]" />,
		title: "Без сайтів-агрегаторів",
	},
	{
		icon: <FaGlobeEurope size={28} className="text-[#4A1158]" />,
		title: "Культурні інсайти",
	},
];

const Features: React.FC = () => {
	return (
		<section className="py-12 px-4">
			<h2 className="md:text-xl font-bold text-center mb-10 ">
				Обери не просто напрям — обери підхід до мандрів!
			</h2>
			<div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{features.map((feature, index) => (
					<div
						key={index}
						className="flex flex-col items-center text-center py-3 px-4 bg-[#F0EDF2] rounded-2xl shadow hover:shadow-md transition h-[140px] sm:h-[160px] md:h-[160px] justify-center"
					>
						{feature.icon}
						<p className="mt-4 text-xs sm:text-sm md:text-base font-medium">
							{feature.title}
						</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default Features;
