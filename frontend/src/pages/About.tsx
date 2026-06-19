import { useTranslation } from "react-i18next";
import TechnologyCard from "../components/TechnologyCard";
import Slider from "react-slick";
import { useMemo } from "react";
import {
	FaReact,
	FaDocker,
	FaPython,
	FaCloudSun,
	FaMoneyBillWave,
} from "react-icons/fa";
import {
	SiTypescript,
	SiTailwindcss,
	SiDjango,
	SiPostgresql,
	SiOpenstreetmap,
} from "react-icons/si";
import Screen_home from "../assets/Screen_home.webp";
import Screen_map from "../assets/Screen_map.webp";
import Screen_plan from "../assets/Screen_plan.webp";
import Screen_rec from "../assets/Screen_rec.webp";

import { TbVectorBezier } from "react-icons/tb";
import { MdRoute } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";

const technologies = [
	{ icon: FaPython, name: "Python" },
	{ icon: SiDjango, name: "Django REST Framework" },
	{ icon: SiTypescript, name: "TypeScript" },
	{ icon: FaReact, name: "React" },
	{ icon: SiTailwindcss, name: "TailwindCSS" },

	{ icon: SiPostgresql, name: "PostgreSQL" },
	{ icon: TbVectorBezier, name: "pgvector" },
	{ icon: TbVectorBezier, name: "Sentence-Transformers" },

	{ icon: FaMapLocationDot, name: "Leaflet" },
	{ icon: SiOpenstreetmap, name: "OpenStreetMap" },
	{ icon: MdRoute, name: "OpenRouteService" },

	{ icon: FaCloudSun, name: "OpenWeatherMap API" },
	{ icon: FaMoneyBillWave, name: "ExchangeRate API" },

	{ icon: FaDocker, name: "Docker" },
];
const About = () => {
	const { t } = useTranslation();

	const sliderSettings = useMemo(
		() => ({
			dots: true,
			infinite: true,
			speed: 500,
			slidesToShow: 4,
			slidesToScroll: 1,
			arrows: false,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3,
					},
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 2,
					},
				},
			],
		}),
		[],
	);

	return (
		<section className="max-w-7xl mx-auto px-6 py-12 md:py-16 text-(--color-text)">
			{/* Hero */}
			<div className="grid md:grid-cols-2 gap-12 items-center mb-16 md:mb-32">
				<div>
					<h1 className="text-xl md:text-3xl font-bold mb-6">
						{t("about.title")}
					</h1>

					<p className="text-lg opacity-80 leading-relaxed">
						{t("about.intro")}
					</p>
				</div>

				<div className="flex justify-center">
					<img
						src={Screen_home}
						alt="Adaptive Travel Guide"
						className="
				w-full
				max-w-xl
				rounded-3xl
				shadow-xl
				border border-(--color-primary)/10
			"
					/>
				</div>
			</div>

			{/* Recommendations */}
			<div className="mb-16 md:mb-32">
				<div className="text-center mb-10">
					<h2 className="text-xl md:text-3xl font-bold mb-6">
						{t("about.recommendations_title")}
					</h2>

					<p className="text-lg opacity-80">
						{t("about.recommendations_text")}
					</p>
				</div>

				<img
					src={Screen_rec}
					alt="Recommendations"
					className="
			w-full
			rounded-3xl
			shadow-xl
			border border-(--color-primary)/10
		"
				/>
			</div>

			{/* Trip Planning */}
			<div className="mb-16 md:mb-32">
				<div className="text-center mb-10">
					<h2 className="text-xl md:text-3xl font-bold mb-6">
						{t("about.routes_title")}
					</h2>

					<p className="text-lg opacity-80">
						{t("about.routes_text")}
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-8 mb-10">
					<img
						src={Screen_plan}
						alt="Trip plan"
						className="
				w-full
				rounded-3xl
				shadow-lg
				border border-(--color-primary)/10
			"
					/>

					<img
						src={Screen_map}
						alt="Route"
						className="
				w-full
				rounded-3xl
				shadow-lg
				border border-(--color-primary)/10
			"
					/>
				</div>
			</div>
			<div>
				<h2 className="text-xl md:text-3xl font-bold text-center mb-10">
					{t("about.tech_title")}
				</h2>

				<div className="lg:hidden">
					<Slider {...sliderSettings}>
						{technologies.map(({ icon: Icon, name }) => (
							<div key={name} className="px-3 pb-8">
								<TechnologyCard icon={Icon} name={name} />
							</div>
						))}
					</Slider>
				</div>

				<div className="hidden lg:grid max-w-6xl mx-auto grid-cols-4 gap-6">
					{technologies.map(({ icon: Icon, name }) => (
						<TechnologyCard key={name} icon={Icon} name={name} />
					))}
				</div>
			</div>
		</section>
	);
};

export default About;
