import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import travelImg from "../assets/sta_image.webp";

const StartTravelAction = () => {
	const { t } = useTranslation();
	const { isAuthenticated } = useAuth();

	const targetPath = isAuthenticated ? "/profile" : "/login";

	return (
		<section className="relative w-full h-auto py-12 mb-12 md:mb-38 px-4">
			<h2 className="relative text-lg md:text-3xl font-bold text-center mb-8 text-(--color-text)">
				{t("sta.title")}
			</h2>

			<div className="relative w-full h-[50vh] min-h-75 overflow-hidden rounded-3xl shadow-xl flex flex-col">
				<div className="absolute inset-0">
					<img
						src={travelImg}
						alt={t("sta.img_alt")}
						className="w-full h-full object-cover"
					/>

					<div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
				</div>

				<div className="relative z-10 mt-auto flex justify-center py-10 md:py-14">
					<a
						href={targetPath}
						className="btn-primary px-12 py-4 md:px-16 md:py-5 text-lg md:text-2xl shadow-2xl scale-110 hover:scale-125"
					>
						{t("sta.button")}
					</a>
				</div>
			</div>
		</section>
	);
};

export default StartTravelAction;
