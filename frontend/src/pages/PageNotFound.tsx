import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bgImage from "../assets/hero_main.png";

const PageNotFound: React.FC = () => {
	const { t } = useTranslation();

	return (
		<div
			className="min-h-screen flex items-center justify-center"
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="w-[340px] sm:w-[450px] bg-[var(--color-bg-main)] rounded shadow-lg p-6 flex flex-col items-center justify-center text-center">
				<h1 className="text-[72px] font-extrabold mb-4 text-[var(--color-purple)]">
					{t("not_found.404")}
				</h1>
				<p className="text-lg mb-6">{t("not_found.page_not_found")}</p>
				<Link
					to="/"
					className="py-3 px-10 bg-[var(--color-purple)] text-white rounded-full hover:bg-[var(--color-purple-hover)]"
				>
					{t("not_found.return_home")}
				</Link>
			</div>
		</div>
	);
};

export default PageNotFound;
