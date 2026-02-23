import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { travelStylesPreview, StylePreview } from "../data/travelStylesPreview";
import "slick-carousel/slick/slick.css";

const TravelStylePicker = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [selectedStyle, setSelectedStyle] = useState<StylePreview | null>(
		null,
	);

	const handlePlanSelection = () => {
		if (selectedStyle) {
			const targetPath = isAuthenticated ? "/profile" : "/register";
			window.scrollTo(0, 0);
			navigate(targetPath);
			setSelectedStyle(null);
		}
	};

	const settings = useMemo(
		() => ({
			dots: true,
			infinite: true,
			speed: 500,
			slidesToShow: 3,
			slidesToScroll: 1,
			arrows: false,
			responsive: [
				{ breakpoint: 1024, settings: { slidesToShow: 2 } },
				{
					breakpoint: 640,
					settings: { slidesToShow: 1 },
				},
			],
		}),
		[],
	);

	return (
		<section className="w-full max-w-6xl mx-auto px-4 py-12 text-(--color-text)">
			<h2 className="text-2xl font-bold text-center mb-10">
				{t("travel_picker.title")}
			</h2>

			<Slider {...settings}>
				{travelStylesPreview.map((style) => {
					const title = t(style.titleKey);

					return (
						<div
							key={style.id}
							className="px-3 pb-8 cursor-pointer outline-none"
							onClick={() => setSelectedStyle(style)}
							tabIndex={-1}
						>
							<div className="text-center group">
								<div className="text-lg font-semibold mb-3 transition-colors group-hover:text-(--color-primary)">
									{title}
								</div>
								<div className="overflow-hidden rounded-2xl shadow-lg border border-white/10">
									<img
										src={style.image}
										alt={title}
										className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
									/>
								</div>
							</div>
						</div>
					);
				})}
			</Slider>
			{selectedStyle && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="bg-(--color-bg-nav-footer) p-8 rounded-3xl max-w-lg w-full border border-white/10 shadow-2xl relative">
						<button
							onClick={() => setSelectedStyle(null)}
							className="absolute top-4 right-4 text-2xl"
						>
							✕
						</button>

						<h3 className="text-2xl font-bold mb-4">
							{t(selectedStyle.titleKey)}
						</h3>
						<p className="mb-4 opacity-70">
							{t("previews.example_plan_title")}
						</p>

						<div className="space-y-4">
							{selectedStyle.locations.map((loc, i) => (
								<div
									key={i}
									className="flex justify-between items-center p-3 bg-white/5 rounded-xl"
								>
									<div>
										<div className="font-medium">
											{t(loc.nameKey)}
										</div>
										<div className="text-xs opacity-50">
											{t(`location_types.${loc.type}`)}
										</div>
									</div>
									<div className="text-(--color-primary)">
										★ {loc.rating}
									</div>
								</div>
							))}
						</div>

						<button
						type="button"
							className="btn-primary w-full mt-6 py-3"
							onClick={handlePlanSelection}
						>
							{t("previews.want_this_plan")}
						</button>
					</div>
				</div>
			)}
		</section>
	);
};

export default TravelStylePicker;
