interface Props {
	value: string;
	onChange: (value: string) => void;
	options: { code: string; name: string }[];
	placeholder: string;
}

const CountryCombobox = ({ value, onChange, options, placeholder }: Props) => {
	const selectedCountryName =
		options.find((c) => c.code === value)?.name || "";

	return (
		<div className="relative">
			<input
				list="countries-list"
				defaultValue={selectedCountryName}
				placeholder={placeholder}
				className="w-full px-4 py-2 rounded-xl bg-(--color-bg-main) border border-(--color-primary)/20 text-(--color-text) outline-none focus:ring-2 focus:ring-(--color-primary)"
				onChange={(e) => {
					const found = options.find(
						(c) => c.name === e.target.value,
					);
					if (found) {
						onChange(found.code);
					}
				}}
			/>

			<datalist id="countries-list">
				{options.map((country) => (
					<option key={country.code} value={country.name} />
				))}
			</datalist>
		</div>
	);
};

export default CountryCombobox;
