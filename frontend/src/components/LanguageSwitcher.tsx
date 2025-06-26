import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const currentLang = i18n.language;
	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<div className="mt-4 text-center">
			<button
				onClick={() => changeLanguage("uk")}
				className={`text-sm mx-2 transition-colors ${
					currentLang === "uk"
						? "text-[var(--color-purple)] font-semibold"
						: "text-[var(--color-text-muted)] hover:text-[var(--color-purple-hover)]"
				}`}
			>
				{t("footer.ukr")}
			</button>

			<span className="text-sm">|</span>
			<button
				onClick={() => changeLanguage("en")}
				className={`text-sm mx-2 transition-colors ${
					currentLang === "en"
						? "text-[var(--color-purple)] font-semibold"
						: "text-[var(--color-text-muted)] hover:text-[var(--color-purple-hover)]"
				}`}
			>
				{t("footer.eng")}
			</button>
		</div>
	);
};

export default LanguageSwitcher;
