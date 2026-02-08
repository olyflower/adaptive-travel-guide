import { Fragment } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language;

	const languages = [
		{ code: "uk", label: t("footer.ukr") },
		{ code: "en", label: t("footer.eng") },
	];

	return (
		<div className="mt-4 text-center flex justify-center items-center space-x-2">
			{languages.map((lang, index) => (
				<Fragment key={lang.code}>
					<button
						onClick={() => i18n.changeLanguage(lang.code)}
						className={`text-sm transition-colors cursor-pointer ${
							currentLang === lang.code
								? "text-(--color-primary) font-semibold"
								: "text-(--color-text) hover:text-(--color-primary-hover)"
						}`}
					>
						{lang.label}
					</button>

					{index < languages.length - 1 && (
						<span className="text-sm text-(--color-text-muted)">
							|
						</span>
					)}
				</Fragment>
			))}
		</div>
	);
};

export default LanguageSwitcher;
