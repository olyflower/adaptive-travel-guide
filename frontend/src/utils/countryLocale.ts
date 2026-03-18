import countries from "i18n-iso-countries";

/**
 * Loads and registers country locale for given language
 */
export const registerCountryLocale = async (lang: string) => {
	try {
		const response = await fetch(`/locales/countries/${lang}.json`);
		const data = await response.json();
		countries.registerLocale(data);
		return true;
	} catch {
		return false;
	}
};
