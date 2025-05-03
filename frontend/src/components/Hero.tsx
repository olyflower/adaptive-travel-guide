import React from "react";
import HeroImage from "../assets/hero.png";

const Hero: React.FC = () => {
	return (
		<div className="w-full mb-10 flex flex-col items-center px-4">
			<img
				className="w-full h-auto object-cover rounded-lg shadow-md mb-8"
				src={HeroImage}
				alt="Подорож"
			/>
			<div className="text-center max-w-3xl">
				<h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-6">
					Адаптивний гід для мандрівників
				</h1>
				<p className="text-base sm:text-lg md:text-xl text-gray-900">
					Досліджуйте найкращі місця світу, отримуйте персоналізовані рекомендації
					та плануйте ідеальну подорож.
				</p>
			</div>
		</div>
	);
};

export default Hero;
