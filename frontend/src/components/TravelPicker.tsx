import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import gourmetImg from "../assets/gourmet.png";
import urbanistImg from "../assets/urban.png";
import natureImg from "../assets/nature.png";
import artistImg from "../assets/artist.png";
import styleImg from "../assets/style.png";

const travelStyles = [
	{ image: gourmetImg, titleKey: "gourmet" },
	{ image: urbanistImg, titleKey: "urban" },
	{ image: natureImg, titleKey: "nature" },
	{ image: artistImg, titleKey: "artist" },
	{ image: styleImg, titleKey: "style" },
];

const TravelStylePicker: React.FC = () => {
	const { t } = useTranslation();

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	return (
		<section className="w-full max-w-6xl mx-auto px-4 py-12">
			<h2 className="text-2xl font-bold text-center mb-10">
				{t("travel_picker.title")}
			</h2>

			<Slider {...settings}>
				{travelStyles.map(({ image, titleKey }, index) => (
					<div key={index} className="px-3">
						<div className="text-center">
							<div className="text-lg font-semibold mb-3">
								{t(`travel_picker.${titleKey}`)}
							</div>
							<img
								src={image}
								alt={t(`travel_picker.${titleKey}`)}
								className="w-full h-60 object-cover rounded-2xl shadow-lg"
							/>
						</div>
					</div>
				))}
			</Slider>
		</section>
	);
};

export default TravelStylePicker;
