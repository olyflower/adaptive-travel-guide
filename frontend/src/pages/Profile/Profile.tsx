import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CountryCombobox from "./CountryCombobox";
import bgImage from "../../assets/hero_main.webp";
import PreferencesSection from "./PreferencesSection";
import Loader from "../../components/Loader";
import { usePreferences } from "../../hooks/usePreferences";
import { useProfileForm } from "../../hooks/useProfileForm";

const Profile = () => {
	const { categories } = usePreferences();
	const { t } = useTranslation();

	const { methods, countryOptions, selectedAvatar, onSubmit, isSubmitting } =
		useProfileForm();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = methods;

	const avatars = [
		{ id: "avatar_1.png", img: "🏕️" },
		{ id: "avatar_2.png", img: "🧗" },
		{ id: "avatar_3.png", img: "🌍" },
		{ id: "avatar_4.png", img: "🎒" },
		{ id: "avatar_5.png", img: "📸" },
	];

	return (
		<>
			{isSubmitting && <Loader />}

			<FormProvider {...methods}>
				<div
					className="flex items-center justify-center min-h-screen p-4"
					style={{
						backgroundImage: `url(${bgImage})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundAttachment: "fixed",
					}}
				>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="relative z-10 w-full max-w-3xl space-y-6"
					>
						<section className="bg-(--color-bg-nav-footer) rounded-3xl shadow-2xl p-8 border border-white/10 mt-10">
							<h2 className="text-2xl font-bold mb-6 text-(--color-text)">
								{t("profile.personal_title")}
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="flex flex-col text-(--color-text)">
									<label>{t("profile.nickname")}</label>
									<input
										{...register("nickname")}
										className="w-full px-4 py-2 rounded-xl bg-(--color-bg-main)
										border border-(--color-primary)/20 focus:ring-2
										focus:ring-(--color-primary) outline-none transition-all hover:border-white/40"
									/>
									{errors.nickname && (
										<p className="text-red-500 text-sm">
											{errors.nickname.message}
										</p>
									)}
								</div>

								<div className="flex flex-col text-(--color-text)">
									<label>{t("profile.avatar")}</label>
									<div className="flex flex-wrap gap-3">
										{avatars.map((av) => (
											<button
												key={av.id}
												type="button"
												onClick={() =>
													setValue("avatar", av.id, {
														shouldDirty: true,
														shouldValidate: true,
													})
												}
												className={`w-12 h-12 rounded-full border ${
													selectedAvatar === av.id
														? "border-2 border-(--color-primary)"
														: ""
												}`}
											>
												{av.img}
											</button>
										))}
									</div>
								</div>

								<div className="flex flex-col text-(--color-text)">
									<label>{t("profile.age")}</label>
									<input
										type="number"
										{...register("age", {
											valueAsNumber: true,
										})}
										className="w-full px-4 py-2 rounded-xl bg-(--color-bg-main) border
										border-(--color-primary)/20 focus:ring-2
										focus:ring-(--color-primary) outline-none transition-all hover:border-white/40"
									/>
									{errors.age && (
										<p className="text-red-500">
											{errors.age.message}
										</p>
									)}
								</div>

								<div className="flex flex-col text-(--color-text)">
									<label>{t("profile.country")}</label>
									<CountryCombobox
										value={watch("country")}
										onChange={(val) =>
											setValue("country", val, {
												shouldValidate: true,
												shouldDirty: true,
											})
										}
										options={countryOptions}
										placeholder={t(
											"profile.select_country",
										)}
									/>
								</div>

								<div className="flex flex-col mt-8 text-(--color-text)">
									<label className="text-sm font-medium mb-2 px-1">
										{t("profile.preferences_text_label")}
									</label>
									<textarea
										{...register("preferences_text")}
										placeholder={t(
											"profile.preferences_text_placeholder",
										)}
										rows={4}
										className="w-full px-4 py-3 rounded-xl bg-(--color-bg-main)
										border border-(--color-primary)/20 text-(--color-text) placeholder-(--color-text) focus:ring-2
										focus:ring-(--color-primary) outline-none transition-all hover:border-white/40 resize-none"
									/>
									{errors.preferences_text && (
										<p className="text-red-500 text-sm mt-1">
											{errors.preferences_text.message}
										</p>
									)}
								</div>

								<div className="flex flex-col">
									<label className="text-sm font-medium text-(--color-text) mb-2 px-1">
										{t("profile.gender")}
									</label>

									<div className="relative group">
										<select
											{...register("gender")}
											className="w-full px-4 py-2 rounded-xl
											bg-(--color-bg-main) border border-(--color-primary)/20 text-(--color-text)
											focus:ring-2 focus:ring-(--color-primary) outline-none appearance-none cursor-pointer transition-all
											hover:border-white/40"
										>
											<option value="M">
												{t("profile.male")}
											</option>
											<option value="F">
												{t("profile.female")}
											</option>
										</select>

										<div
											className="absolute inset-y-0 right-4 flex items-center pointer-events-none
											text-(--color-text)/30 group-hover:text-(--color-primary)/60 transition-colors"
										>
											<svg
												className="w-5 h-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</div>
									</div>
								</div>
							</div>
						</section>

						<PreferencesSection categories={categories} />

						<div className="flex justify-center my-10">
							<button
								type="submit"
								disabled={isSubmitting}
								className="btn-primary px-16 py-4"
							>
								{t("profile.save")}
							</button>
						</div>
					</form>
				</div>
			</FormProvider>
		</>
	);
};

export default Profile;
