import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/baloon.jpg";

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
			<div className="max-w-md w-full p-6  bg-white rounded shadow-lg text-center">
				<h1 className="text-4xl font-extrabold mb-4 text-[#0099A9]">
					404
				</h1>
				<p className="text-lg mb-6">Сторінку не знайдено</p>
				<Link
					to="/"
					className="inline-block py-2 px-6 bg-[#0099A9] text-white rounded hover:bg-[#007f8a] transition"
				>
					Повернутися на головну
				</Link>
			</div>
		</div>
	);
};

export default PageNotFound;
