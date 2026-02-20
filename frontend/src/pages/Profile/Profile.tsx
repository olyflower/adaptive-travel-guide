import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CountryCombobox from "./CountryCombobox";
import { useCountryOptions } from "../../hooks/useCountries";
import * as Yup from "yup";
import axios from "axios";
import bgImage from "../../assets/hero_main.webp";
import PreferencesSection from "./PreferencesSection";
import { usePreferences } from "../../hooks/usePreferences";
import countries from "i18n-iso-countries";

const registerCountryLang = async (lang: string) => {
	try {
		const response = await fetch(`/locales/countries/${lang}.json`);
		const data = await response.json();
		countries.registerLocale(data);
		return true;
	} catch (error) {
		console.error();
		return false;
	}
};

const Profile = () => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const { categories } = usePreferences();
	const [isReady, setIsReady] = useState(false);
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();

	const countryOptions = useCountryOptions(isReady);

	useEffect(() => {
		const loadData = async () => {
			setIsReady(false);

			const ok = await registerCountryLang(i18n.language);

			if (ok) setIsReady(true);
		};

		loadData();
	}, [i18n.language]);

	const avatars = [
		{ id: "avatar_1.png", img: "🏕️" },
		{ id: "avatar_2.png", img: "🧗" },
		{ id: "avatar_3.png", img: "🌍" },
		{ id: "avatar_4.png", img: "🎒" },
		{ id: "avatar_5.png", img: "📸" },
		{ id: "avatar_6.png", img: "🗺️" },
	];

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get(
					`${apiUrl}/api/auth/profile/save-full/`,
					{
						withCredentials: true,
					},
				);

				formik.setValues(response.data);
			} catch (error) {
				console.error("Failed to fetch profile", error);
				navigate("/");
			}
		};
		fetchProfile();
	}, [apiUrl, navigate]);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			nickname: "",
			avatar: "default_avatar.png",
			age: "",
			country: "",
			gender: "M",
			selectedOptions: [] as number[],
		},
		validationSchema: Yup.object({
			nickname: Yup.string()
				.required(t("errors.required"))
				.min(2, t("errors.too_short")),
			age: Yup.number()
				.required(t("errors.required"))
				.min(14, t("errors.age"))
				.max(100, t("errors.age")),

			country: Yup.string().required(t("errors.required")),
			gender: Yup.string()
				.oneOf(["M", "F"])
				.required(t("errors.required")),
		}),
		onSubmit: async (values) => {
			try {
				await axios.post(
					`${apiUrl}/api/auth/profile/save-full/`,
					values,
					{
						withCredentials: true,
					},
				);

				setTimeout(() => navigate("/"), 1000);
			} catch (error) {}
		},
	});

	return (
		<div
			className="min-h-screen p-4 flex justify-center items-start pt-20"
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
			}}
		>
			<div className="relative z-10 w-full max-w-3xl space-y-6">
				<section className="bg-(--color-bg-nav-footer) rounded-3xl shadow-2xl p-8 border border-white/10">
					<h2 className="text-2xl font-bold mb-6 text-(--color-text) flex items-center">
						{t("profile.personal_title")}
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="flex flex-col">
							<label className="text-sm font-medium text-(--color-text)/70 mb-2">
								{t("profile.nickname")}
							</label>
							<input
								type="text"
								{...formik.getFieldProps("nickname")}
								placeholder={t("profile.select_nickname")}
								className="px-4 py-2 rounded-xl bg-(--color-bg-main) border border-(--color-primary)/20 text-(--color-text) outline-none focus:ring-2 focus:ring-(--color-primary)"
							/>
							{formik.touched.nickname &&
								formik.errors.nickname && (
									<p className="text-(--color-red) text-sm mt-1">
										{formik.errors.nickname}
									</p>
								)}
						</div>
						<div className="flex flex-col">
							<label className="text-sm font-medium text-(--color-text)/70 mb-2">
								{t("profile.avatar")}
							</label>
							<div className="flex flex-wrap gap-3">
								{avatars.map((av) => (
									<button
										key={av.id}
										type="button"
										onClick={() =>
											formik.setFieldValue(
												"avatar",
												av.id,
											)
										}
										className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all border-2 ${
											formik.values.avatar === av.id
												? "border-(--color-primary) bg-(--color-primary)/20 scale-110"
												: "border-white/10 bg-(--color-bg-main) hover:border-(--color-primary)/40"
										}`}
									>
										{av.img}
									</button>
								))}
							</div>
						</div>
						<div className="flex flex-col">
							<label className="text-sm font-medium text-(--color-text)/70 mb-2">
								{t("profile.age")}
							</label>
							<input
								type="number"
								min={14}
								max={100}
								{...formik.getFieldProps("age")}
								onBlur={formik.handleBlur}
								placeholder={t("profile.select_age")}
								className="px-4 py-2 rounded-xl bg-(--color-bg-main) border border-(--color-primary)/20 text-(--color-text) focus:ring-2 focus:ring-(--color-primary) outline-none"
							/>
							{formik.touched.age && formik.errors.age && (
								<p className="text-(--color-red) text-sm mt-1">
									{formik.errors.age}
								</p>
							)}
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-(--color-text)/70 mb-2">
								{t("profile.country")}
							</label>
							<CountryCombobox
								value={formik.values.country}
								onChange={(val) =>
									formik.setFieldValue("country", val)
								}
								options={countryOptions}
								placeholder={t("profile.select_country")}
							/>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-(--color-text)/70 mb-2">
								{t("profile.gender")}
							</label>
							<select
								{...formik.getFieldProps("gender")}
								className="px-4 py-2 rounded-xl bg-(--color-bg-main) border border-(--color-primary)/20 text-(--color-text) focus:ring-2 focus:ring-(--color-primary) outline-none"
							>
								<option value="M">{t("profile.male")}</option>
								<option value="F">{t("profile.female")}</option>
							</select>
						</div>
					</div>
				</section>

				<PreferencesSection categories={categories} formik={formik} />

				<div className="flex flex-col items-center">
					<button
						onClick={() => formik.handleSubmit()}
						type="button"
						disabled={formik.isSubmitting}
						className="btn-primary w-full md:w-auto px-16 py-4 rounded-2xl text-lg font-bold shadow-lg transition-transform active:scale-95"
					>
						{t("profile.save")}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
