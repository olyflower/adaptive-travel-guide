import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import travelImg from "../assets/sta_image.png";

const StartTravelAction: React.FC = () => {
	const { t } = useTranslation();
	const { isAuthenticated } = useAuth();

	return (
		<section className="relative w-full h-auto py-12 mb-10">
			<h2 className="relative md:text-xl font-bold text-center mb-6 z-10">
				{t("sta.title")}
			</h2>

			<div className="relative w-full h-[calc(50vh-3rem)] overflow-hidden flex flex-col">
				<img
					src={travelImg}
					alt="Початок подорожі"
					className="absolute top-0 left-0 w-full h-full object-cover"
				/>

				<div className="relative z-10 mt-auto flex justify-center py-6">
					{isAuthenticated ? (
						<>
							<a
								href="/profile"
								className="bg-[var(--color-primary)] text-white rounded-full font-semibold hover:bg-[#370c41] transition inline-block px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg"
							>
								{t("sta.button")}
							</a>
						</>
					) : (
						<>
							<a
								href="/login"
								className="bg-[var(--color-primary)] text-white rounded-full font-semibold hover:bg-[#370c41] transition inline-block px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg"
							>
								{t("sta.button")}
							</a>
						</>
					)}
				</div>
			</div>
		</section>
	);
};

export default StartTravelAction;
