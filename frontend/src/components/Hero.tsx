import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import HeroImageDesktop from "../assets/hero_main.png";

const Hero: React.FC = () => {
	const { t } = useTranslation();
	const { isAuthenticated } = useAuth();

	return (
		<div className="relative w-full h-auto min-h-[60vh] md:min-h-[100vh] flex items-center justify-center mb-10 px-4">
			<img
				className="absolute top-0 left-0 w-full h-full object-cover"
				src={HeroImageDesktop}
				alt={t("hero.img_alt")}
			/>

			<div className="relative z-10 text-center max-w-3xl text-white px-4">
				<h1
					className="text-2xl sm:text-4xl md:text-5xl font-bold mb-12 md:mb-24 drop-shadow-2xl"
					style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
				>
					{t("hero.title")}
				</h1>
				<p
					className="text-base sm:text-lg md:text-xl mb-12 md:mb-24 drop-shadow-xl leading-loose"
					style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
				>
					{t("hero.text")}
				</p>
				{isAuthenticated ? (
					<>
						<a
							href="/profile"
							className="inline-block bg-[var(--color-purple)] hover:bg-[var(--color-purple-hover)] px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg rounded-full font-semibold"
						>
							{t("hero.button")}
						</a>
					</>
				) : (
					<>
						<a
							href="/login"
							className="inline-block bg-[var(--color-purple)] hover:bg-[var(--color-purple-hover)] px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg rounded-full font-semibold"
						>
							{t("hero.button")}
						</a>
					</>
				)}
			</div>
		</div>
	);
};

export default Hero;
