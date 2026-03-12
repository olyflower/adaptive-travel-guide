import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DestinationInput from "../components/DestinationInput";
import { useTranslation } from "react-i18next";
import HeroImageDesktop from "../assets/hero_main.webp";

const Hero = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { isAuthenticated, user } = useAuth();

	const handleSearch = (city: string) => {
		if (!isAuthenticated) {
			navigate("/login");
		} else if (!user?.profile?.profile_complete) {
			navigate("/profile");
		} else {
			navigate(`/recommendations?city=${encodeURIComponent(city)}`);
		}
	};

	return (
		<div className="relative w-full h-auto min-h-[60vh] md:min-h-screen flex items-center justify-center mb-10 px-4">
			<img
				className="absolute top-0 left-0 w-full h-full object-cover"
				src={HeroImageDesktop}
				alt={t("hero.img_alt")}
			/>

			<div className="relative z-10 text-center max-w-4xl text-white px-4">
				<h1
					className="text-3xl sm:text-5xl md:text-7xl font-bold mb-8 md:mb-12 drop-shadow-2xl"
					style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, 0.7)" }}
				>
					{t("hero.title")}
				</h1>

				<p
					className="text-lg sm:text-xl md:text-2xl mb-12 md:mb-16 drop-shadow-xl leading-relaxed max-w-2xl mx-auto"
					style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
				>
					{t("hero.text")}
				</p>

				<div className="flex justify-center">
					<DestinationInput onSearch={handleSearch} />
				</div>
			</div>
		</div>
	);
};

export default Hero;
