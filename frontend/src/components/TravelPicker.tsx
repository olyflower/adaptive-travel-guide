import React from "react";
import gourmetImg from "../assets/gourmet.png";
import urbanistImg from "../assets/urban.png";
import natureImg from "../assets/nature.png";
import artistImg from "../assets/artist.png";
import styleImg from "../assets/style.png";

const travelStyles = [
	{ title: "Гурман", image: gourmetImg },
	{ title: "Урбаніст", image: urbanistImg },
	{ title: "Дослідник природи", image: natureImg },
	{ title: "Цінувач стилю", image: styleImg },
	{ title: "Митець", image: artistImg },
];

const TravelStylePicker: React.FC = () => {
	return (
		<section className="w-full max-w-6xl mx-auto px-4 py-12">
			{/* Desktop */}
			<div className="hidden sm:grid grid-rows-3 gap-6 place-items-center">
				<div className="flex gap-16">
					{travelStyles.slice(0, 2).map((style, idx) => (
						<div key={idx} className="flex flex-col items-center">
							<div className="mb-2">{style.title}</div>
							<img
								src={style.image}
								alt={style.title}
								className="w-90 h-27 object-cover rounded-xl shadow-md"
							/>
						</div>
					))}
				</div>

				<div className="flex items-center justify-between w-full">
					<div className="flex flex-col items-center">
						<div className="mb-2">{travelStyles[2].title}</div>
						<img
							src={travelStyles[2].image}
							alt={travelStyles[2].title}
							className="w-90 h-27 object-cover rounded-xl shadow-md"
						/>
					</div>

					<h2 className="text-xl font-bold text-center">
						Обери свій стиль мандрівки
					</h2>

					<div className="flex flex-col items-center">
						<div className="mb-2">{travelStyles[3].title}</div>
						<img
							src={travelStyles[3].image}
							alt={travelStyles[3].title}
							className="w-90 h-27 object-cover rounded-xl shadow-md"
						/>
					</div>
				</div>

				<div className="flex flex-col items-center">
					<div className="mb-2">{travelStyles[4].title}</div>
					<img
						src={travelStyles[4].image}
						alt={travelStyles[4].title}
						className="w-90 h-27 object-cover rounded-xl shadow-md"
					/>
				</div>
			</div>

			{/* Mobile Carousel */}
			<div className="sm:hidden">
				<h2 className="font-bold text-center mb-6">
					Обери свій стиль мандрівки
				</h2>
				<div className="flex gap-4 overflow-x-auto scrollbar-hide px-2">
					{travelStyles.map((style, idx) => (
						<div
							key={idx}
							className="flex-shrink-0 w-40 text-center"
						>
							<div className="text-sm mb-1">{style.title}</div>
							<img
								src={style.image}
								alt={style.title}
								className="w-40 h-40 object-cover rounded-xl shadow"
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TravelStylePicker;
