import React from "react";
import { FaCloudSun, FaEuroSign, FaCalendarAlt } from "react-icons/fa";
import BgImage from "../assets/livedata.png";

const LiveData: React.FC = () => {
	return (
		<section className="w-full">
			<div className="text-center py-10 px-4">
				<h2 className="md:text-xl font-bold mb-2">
					Актуальна інформація
				</h2>
				<p className="text-sm md:text-base">
					Погода, курс валют і події оновлюються щодня
				</p>
			</div>

			<div className="max-w-6xl mx-auto px-4">
				<div className="relative w-full h-[calc(40vh-3rem)] overflow-hidden rounded-lg">
					<img
						src={BgImage}
						alt="City"
						className="w-full h-full object-cover"
					/>
				</div>
			</div>

			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-10 px-4">
				<div className="p-6 text-center">
					<div className="flex justify-center mb-3">
						<FaCloudSun size={28} className="text-[#4A1158]" />
					</div>
					<h3 className="text-lg font-semibold mb-2">Погода</h3>
					<p className="text-2xl font-bold pb-2">☀️ 22°C</p>
					<p className="text-sm">Париж</p>
				</div>

				<div className="p-6 text-center">
					<div className="flex justify-center mb-3">
						<FaEuroSign size={28} className="text-[#4A1158]" />
					</div>
					<h3 className="text-lg font-semibold mb-2">Курс валют</h3>
					<p className="text-2xl font-bold pb-2">€ 47.35</p>
					<p className="text-sm">EUR-UAH</p>
				</div>

				<div className="p-6 text-center">
					<div className="flex justify-center mb-3">
						<FaCalendarAlt size={28} className="text-[#4A1158]" />
					</div>
					<h3 className="text-lg font-semibold mb-2">Події</h3>
					<p className="text-base font-medium mb-1 pb-2">
						Фестиваль вуличної їжи
					</p>
					<p className="text-sm">12 червня, Париж</p>
				</div>
			</div>
		</section>
	);
};

export default LiveData;
