import { Category } from "../../types/preferences";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getTranslatedName } from "../../utils/translate";

interface PreferencesSectionProps {
	categories: Category[];
}

const PreferencesSection = ({ categories }: PreferencesSectionProps) => {
	const { i18n, t } = useTranslation();
	const { watch, setValue } = useFormContext();
	const selectedOptions: number[] = watch("selectedOptions") || [];

	return (
		<section className="bg-(--color-bg-nav-footer) rounded-3xl shadow-2xl p-8 border border-white/10">
			<h2 className="text-2xl font-bold mb-6 text-(--color-text)">
				{t("profile.preferences_title")}
			</h2>

			<div className="space-y-6">
				{categories.map((category) => {
					const currentCategoryIds = category.options.map(
						(o) => o.id,
					);
					const selectedOptionId =
						selectedOptions.find((id) =>
							currentCategoryIds.includes(id),
						) || "";

					return (
						<div key={category.id} className="flex flex-col">
							<label className="text-sm font-medium text-(--color-text)/70 mb-2 px-1">
								{getTranslatedName(category, i18n, "name")}
							</label>

							<div className="relative group">
								<select
									className="w-full px-4 py-3 rounded-xl bg-(--color-bg-main) border border-(--color-primary)/20 
									text-(--color-text) focus:ring-2 focus:ring-(--color-primary) outline-none appearance-none 
									cursor-pointer transition-all hover:border-(--color-primary)/40"
									value={selectedOptionId}
									onChange={(e) => {
										const newId = Number(e.target.value);

										const otherCategoriesSelected =
											selectedOptions.filter(
												(id) =>
													!currentCategoryIds.includes(
														id,
													),
											);

										const updatedOptions = newId
											? [
													...otherCategoriesSelected,
													newId,
												]
											: otherCategoriesSelected;

										setValue(
											"selectedOptions",
											updatedOptions,
										);
									}}
								>
									<option value="">
										{t("profile.not_selected")}
									</option>
									{category.options.map((option) => (
										<option
											key={option.id}
											value={option.id}
										>
											{getTranslatedName(
												option,
												i18n,
												"name",
											)}
										</option>
									))}
								</select>

								<div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-(--color-text)/30 
								group-hover:text-(--color-primary)/60 transition-colors">
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
					);
				})}
			</div>
		</section>
	);
};

export default PreferencesSection;
