import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bgImage from "../assets/hero_main.webp";

const PageNotFound = () => {
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
			<div
				className="relative z-10 w-85 sm:w-112.5 rounded-3xl shadow-2xl p-8 flex flex-col 
      items-center justify-center text-center bg-(--color-bg-nav-footer) backdrop-blur-sm"
			>
				<h1 className="text-[80px] font-extrabold mb-2 text-(--color-primary) leading-none">
					{t("not_found.404")}
				</h1>

				<p className="text-xl mb-8 text-(--color-text) font-medium">
					{t("not_found.page_not_found")}
				</p>

				<Link to="/" className="btn-primary px-10">
					{t("not_found.return_home")}
				</Link>
			</div>
		</div>
	);
};

export default PageNotFound;
