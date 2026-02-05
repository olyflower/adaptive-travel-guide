import React from "react";
import { useTranslation } from "react-i18next";
import aboutImage from "../assets/about.jpg";

const About: React.FC = () => {
	const { t } = useTranslation();

	return (
		<section
			className="w-full py-10 px-4 mt-8 md:mt-12 mb-24 md:mb-32 max-w-6xl 
			mx-auto bg-(--color-background-main) text-(--color-text)"
		>
			<h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
				{t("about.title")}
			</h1>

			<div className="flex flex-col md:flex-row items-center gap-10">
				<img
					src={aboutImage}
					alt={t("about.img_alt")}
					className="w-full md:w-1/2 h-64 md:h-96 rounded-lg shadow-lg object-cover object-center"
				/>

				<div className="w-full md:w-1/2 text-lg leading-relaxed space-y-4">
					<p>{t("about.p1")}</p>
					<p>{t("about.p2")}</p>
					<p>{t("about.p3")}</p>
				</div>
			</div>
		</section>
	);
};

export default About;
