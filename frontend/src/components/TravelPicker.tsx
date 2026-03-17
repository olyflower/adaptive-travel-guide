import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { travelStylesPreview, StylePreview } from "../data/travelStylesPreview";
import {
	FaMapMarkerAlt,
	FaCloudSun,
	FaLanguage,
	FaTimes,
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";

const TravelStylePicker = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [selectedStyle, setSelectedStyle] = useState<StylePreview | null>(
		null,
	);

	const handlePlanSelection = () => {
		if (!selectedStyle) return;

		const targetPath = isAuthenticated ? "/profile" : "/register";
		window.scrollTo(0, 0);
		navigate(targetPath);
		setSelectedStyle(null);
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
				{ breakpoint: 640, settings: { slidesToShow: 1 } },
			],
		}),
		[],
	);

	return (
		<section className="w-full max-w-6xl mx-auto px-4 py-8 md:py-16 text-(--color-text)">
			<h2 className="text-lg md:text-3xl font-bold text-center mb-6">
				{t("travel_picker.title")}
			</h2>

			<Slider {...settings}>
				{travelStylesPreview.map((style) => {
					const title = t(style.titleKey);

					return (
						<div key={style.id} className="px-3 pb-8 outline-none">
							<button
								type="button"
								onClick={() => setSelectedStyle(style)}
								className="w-full text-left bg-(--color-bg-nav-footer) rounded-3xl overflow-hidden border border-(--color-primary)/10 shadow-lg hover:border-(--color-primary) transition-all group"
							>
								<div className="overflow-hidden">
									<img
										src={style.image}
										alt={title}
										className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								</div>

								<div className="p-5">
									<h3 className="text-xl font-bold mb-2 group-hover:text-(--color-primary) transition-colors">
										{title}
									</h3>

									<div className="space-y-2 mb-4">
										{style.locations
											.slice(0, 3)
											.map((loc, i) => (
												<div
													key={i}
													className="flex items-center justify-between text-sm bg-white/5 rounded-xl px-3 py-2"
												>
													<div className="min-w-0">
														<div className="font-medium truncate">
															{t(loc.nameKey)}
														</div>
														<div className="text-xs opacity-50">
															{t(
																`location_types.${loc.type}`,
															)}
														</div>
													</div>
												</div>
											))}
									</div>

									<div className="mt-8 flex items-center gap-3 text-xs text-(--color-primary) font-bold uppercase tracking-wider">
										<span>
											{t("previews.open_preview")}
										</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 8l4 4m0 0l-4 4m4-4H3"
											/>
										</svg>
									</div>
								</div>
							</button>
						</div>
					);
				})}
			</Slider>

			{selectedStyle && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="bg-(--color-bg-nav-footer) rounded-3xl max-w-6xl w-full border border-white/10 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
						<button
							type="button"
							onClick={() => setSelectedStyle(null)}
							className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition"
						>
							<FaTimes />
						</button>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
							<div className="lg:col-span-2 p-8 md:p-10">
								<div className="mb-8">
									<h3 className="text-3xl md:text-5xl font-bold text-(--color-text) mb-3">
										{t(selectedStyle.titleKey)}
									</h3>
								</div>

								<section>
									<h4 className="text-2xl font-bold text-(--color-text) mb-6 border-l-4 border-(--color-primary) pl-4">
										{t("plans.places")}
									</h4>

									<div className="space-y-4">
										{selectedStyle.locations.map(
											(loc, i) => (
												<div
													key={i}
													className="bg-white/5 p-5 rounded-3xl border border-(--color-primary)/10 shadow-sm"
												>
													<div className="flex items-start justify-between gap-4 mb-2">
														<h5 className="text-lg font-bold text-(--color-text)">
															{t(loc.nameKey)}
														</h5>
													</div>

													<p className="text-sm text-(--color-text) opacity-70">
														{t(
															`location_types.${loc.type}`,
														)}
													</p>
												</div>
											),
										)}
									</div>
								</section>
							</div>

							<div className="p-8 md:p-10 bg-black/10 flex flex-col h-full min-h-125">
								<div className="grow space-y-6">
									<h4 className="text-xl font-bold text-(--color-text) mb-4">
										{t("previews.why_register")}
									</h4>

									<div className="bg-(--color-primary)/5 border border-(--color-primary)/10 p-5 rounded-3xl">
										<div className="flex items-center gap-3 mb-2 text-(--color-primary)">
											<FaMapMarkerAlt size={20} />
											<h5 className="font-bold text-sm uppercase tracking-wider">
												{t(
													"previews.smart_route_title",
												)}
											</h5>
										</div>
										<p className="text-xs opacity-70 leading-relaxed">
											{t("previews.smart_route_desc")}
										</p>
									</div>

									<div className="bg-(--color-primary)/5 border border-(--color-primary)/10 p-5 rounded-3xl">
										<div className="flex items-center gap-3 mb-2 text-(--color-primary)">
											<FaCloudSun size={20} />
											<h5 className="font-bold text-sm uppercase tracking-wider">
												{t("previews.live_data_title")}
											</h5>
										</div>
										<p className="text-xs opacity-70 leading-relaxed">
											{t("previews.live_data_desc")}
										</p>
									</div>

									<div className="bg-(--color-primary)/5 border border-(--color-primary)/10 p-5 rounded-3xl">
										<div className="flex items-center gap-3 mb-2 text-(--color-primary)">
											<FaLanguage size={20} />
											<h5 className="font-bold text-sm uppercase tracking-wider">
												{t("previews.phrasebook_title")}
											</h5>
										</div>
										<p className="text-xs opacity-70 leading-relaxed">
											{t("previews.phrasebook_desc")}
										</p>
									</div>
								</div>

								<button
									type="button"
									className="btn-primary w-full py-4 mt-8 text-lg font-bold shadow-xl shadow-(--color-primary)/20"
									onClick={handlePlanSelection}
								>
									{t("previews.want_this_plan")}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default TravelStylePicker;
