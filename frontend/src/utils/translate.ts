export const getTranslatedName = (
	item: any,
	i18n: any,
	field: string = "name",
) => {
	const lang = i18n.language === "ua" ? "uk" : i18n.language;
	const translatedField = `${field}_${lang}`;

	return item[translatedField] || item[field] || "";
};
