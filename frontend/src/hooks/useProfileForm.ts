import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useCountryOptions } from "../hooks/useCountries";
import { registerCountryLocale } from "../utils/countryLocale";
import { clearRecommendationCache } from "../services/RecommendationService";
import { getProfile, saveProfile } from "../services/ProfileService";

export type ProfileFormValues = {
	nickname: string;
	avatar: string;
	age: number;
	country: string;
	gender: "M" | "F";
	selectedOptions: number[];
	preferences_text: string;
};

/**
 * Hook for managing profile form state, validation,
 * profile loading, localized countries, and form submission.
 */
export const useProfileForm = () => {
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
		reset,
		watch,
		formState: { isSubmitting },
	} = methods;

	const selectedAvatar = watch("avatar");

	useEffect(() => {
		const loadCountries = async () => {
			setIsReady(false);
			const isLocaleLoaded = await registerCountryLocale(i18n.language);
			if (isLocaleLoaded) setIsReady(true);
		};

		loadCountries();
	}, [i18n.language]);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const data = await getProfile();

				reset({
					...data,
					selectedOptions: data.selectedOptions ?? [],
				});
			} catch {
				navigate("/");
			}
		};

		fetchProfile();
	}, [navigate, reset]);

	const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
		try {
			await saveProfile(values);

			clearRecommendationCache();
			navigate("/");
		} catch {}
	};

	return {
		methods,
		countryOptions,
		selectedAvatar,
		onSubmit,
		isSubmitting,
	};
};
