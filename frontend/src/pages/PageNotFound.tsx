import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/hero_main.png";

const PageNotFound: React.FC = () => {
	return (
		<div
			className="min-h-screen flex items-center justify-center"
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="w-[340px] sm:w-[450px] bg-[#F6F0FA] rounded shadow-lg p-6 flex flex-col items-center justify-center text-center">
				<h1 className="text-[72px] font-extrabold mb-4 text-[#4A1158]">
					404
				</h1>
				<p className="text-lg mb-6">Сторінку не знайдено</p>
				<Link
					to="/"
					className="py-3 px-10 bg-[#4A1158] text-white rounded-full hover:bg-[#381047]"
				>
					Повернутися на головну
				</Link>
			</div>
		</div>
	);
};

export default PageNotFound;
