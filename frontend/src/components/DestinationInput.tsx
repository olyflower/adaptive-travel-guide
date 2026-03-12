import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface FormData {
	city: string;
}

interface DestinationInputProps {
	onSearch: (cityName: string) => void;
}

const DestinationInput = ({ onSearch }: DestinationInputProps) => {
	const { t } = useTranslation();

	const { register, handleSubmit, reset } = useForm<FormData>();

	const onSubmit = (data: FormData) => {
		const value = data.city.trim();
		if (value) {
			onSearch(value);
			reset();
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="relative w-full max-w-md mx-auto"
		>
			<input
				{...register("city")}
				type="text"
				placeholder={t("hero.destination")}
				className="
				block w-full
				py-4 pl-6 pr-16
				rounded-full
				bg-(--color-bg-main)
				text-(--color-text)
				border border-(--color-primary)
				placeholder:text-(--color-text)/50
				shadow-lg
				focus:outline-none
				focus:ring-2
				focus:ring-(--color-primary)
				transition-all
				"
			/>

			<button
				type="submit"
				className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary p-3 flex items-center justify-center"
			>
				<FaSearch size={16} />
			</button>
		</form>
	);
};

export default DestinationInput;
