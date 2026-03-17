import { useEffect, useState, useMemo } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CountryCombobox from "./CountryCombobox";
import { useCountryOptions } from "../../hooks/useCountries";
import * as Yup from "yup";
import axios from "axios";
import bgImage from "../../assets/hero_main.webp";
import PreferencesSection from "./PreferencesSection";
import Loader from "../../components/Loader";
import { usePreferences } from "../../hooks/usePreferences";
import { clearRecommendationCache } from "../../services/RecommendationService";
import countries from "i18n-iso-countries";

type ProfileFormValues = {
	nickname: string;
	avatar: string;
	age: number;
	country: string;
	gender: "M" | "F";
	selectedOptions: number[];
	preferences_text: string;
};

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Registers country names for the given language in i18n-iso-countries library
 * @param lang - language code (e.g., "en", "uk")
 * @returns true if locale was successfully registered
 */
const registerCountryLang = async (lang: string) => {
	try {
		const response = await fetch(`/locales/countries/${lang}.json`);
		const data = await response.json();
		countries.registerLocale(data);
		return true;
	} catch (error) {
		return false;
	}
};

/**
 * Profile page component
 * Allows users to view and edit their personal profile information, including:
 * - nickname, avatar, age, country, gender
 * - travel preferences and selected options
 * Handles form validation, submission to API, and cache clearing for recommendations.
 */

const Profile = () => {
	const { categories } = usePreferences();
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const [isReady, setIsReady] = useState(false);

	const countryOptions = useCountryOptions(isReady);

	const validationSchema = useMemo(
		() =>
			Yup.object({
				nickname: Yup.string()
					.required(t("errors.required"))
					.min(2, t("errors.too_short")),

				avatar: Yup.string().required(),

				age: Yup.number()
					.transform((value, originalValue) =>
						originalValue === "" ? undefined : value,
					)
					.required(t("errors.required"))
					.min(14, t("errors.age"))
					.max(100, t("errors.age")),

				country: Yup.string().required(t("errors.required")),

				gender: Yup.mixed<"M" | "F">()
					.oneOf(["M", "F"])
					.required(t("errors.required")),

				preferences_text: Yup.string()
					.max(500, t("errors.too_long"))
					.required(t("errors.required")),

				selectedOptions: Yup.array()
					.of(Yup.number().required())
					.required()
					.default([]),
			}),
		[t],
	);

	const methods = useForm<ProfileFormValues>({
		resolver: yupResolver(validationSchema),
		mode: "onBlur",
		defaultValues: {
			nickname: "",
			avatar: "default_avatar.png",
			age: undefined,
			country: "",
			gender: "M",
			preferences_text: "",
			selectedOptions: [],
		},
	});

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
		reset,
	} = methods;

	const selectedAvatar = watch("avatar");

	useEffect(() => {
		const loadData = async () => {
			setIsReady(false);
			const ok = await registerCountryLang(i18n.language);
			if (ok) setIsReady(true);
		};

		loadData();
	}, [i18n.language]);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/api/auth/profile/save-full/`,
					{ withCredentials: true },
				);

				reset({
					...response.data,
					selectedOptions: response.data.selectedOptions ?? [],
				});
			} catch {
				navigate("/");
			}
		};

		fetchProfile();
	}, [navigate, reset]);

	/**
	 * Handles profile form submission
	 * Sends updated profile data to the backend and clears cached recommendations
	 * On success, redirects user to home page after a short delay
	 * @param values - all profile form values
	 */
	const onSubmit: SubmitHandler<ProfileFormValues> = async (
		values: ProfileFormValues,
	) => {
		try {
			await axios.post(`${API_URL}/api/auth/profile/save-full/`, values, {
				withCredentials: true,
			});

			clearRecommendationCache();

			setTimeout(() => navigate("/"), 1000);
		} catch {}
	};

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
						<section className="bg-(--color-bg-nav-footer) rounded-3xl shadow-2xl p-8 border border-white/10">
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

						<div className="flex justify-center">
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
