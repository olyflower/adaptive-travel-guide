import { useTranslation } from "react-i18next";
import countries from "i18n-iso-countries";
import { useMemo } from "react";

/**
 * Custom hook that returns a list of countries based on the current UI language
 * Uses i18n language to localize country names
 */

export const useCountryOptions = (isReady: boolean) => {
	const { i18n } = useTranslation();

	return useMemo(() => {
		const currentLang = i18n.language === "uk" ? "uk" : "en";

		const countryList = countries.getNames(currentLang) || {};

		return Object.entries(countryList).map(([code, name]) => ({
			code,
			name: name as string,
		}));
	}, [i18n.language, isReady]);
};
