import React from "react";
import travelImg from "../assets/sta_image.png";

const StartTravelAction: React.FC = () => {
	return (
		<section className="relative w-full h-auto py-12 mb-10">
			<h2 className="relative md:text-xl font-bold text-center mb-6 z-10">
				Готовий розпочати свою мандрівку?
			</h2>

			<div className="relative w-full h-[calc(50vh-3rem)] overflow-hidden flex flex-col">
				<img
					src={travelImg}
					alt="Початок подорожі"
					className="absolute top-0 left-0 w-full h-full object-cover"
				/>

				<div className="relative z-10 mt-auto flex justify-center py-6">
					<a
						href="/login"
						className="bg-[#4A1158] text-white rounded-full font-semibold hover:bg-[#370c41] transition inline-block px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg"
					>
						Створи свій профіль
					</a>
				</div>
			</div>
		</section>
	);
};

export default StartTravelAction;
