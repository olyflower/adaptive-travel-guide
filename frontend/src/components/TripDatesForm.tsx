import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaCalendarAlt } from "react-icons/fa";

type TripDatesFormProps = {
	initialStartDate: string | null;
	initialEndDate: string | null;
	isSaving: boolean;
	onSave: (startDate: string | null, endDate: string | null) => Promise<void>;
	onCancel: () => void;
};

type TripDatesFormValues = {
	start_date: string;
	end_date: string;
};

const TripDatesForm = ({
	initialStartDate,
	initialEndDate,
	isSaving,
	onSave,
	onCancel,
}: TripDatesFormProps) => {
	const { t } = useTranslation();

	const schema = yup.object({
		start_date: yup.string().default(""),
		end_date: yup
			.string()
			.default("")
			.test("date-order", t("plans.error_date_order"), function (value) {
				const { start_date } = this.parent;
				if (!start_date || !value) return true;
				return value >= start_date;
			}),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TripDatesFormValues>({
		resolver: yupResolver(schema),
		defaultValues: {
			start_date: initialStartDate ?? "",
			end_date: initialEndDate ?? "",
		},
	});

	const onSubmit = async (data: TripDatesFormValues) => {
		await onSave(data.start_date || null, data.end_date || null);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4 mt-6 p-5 rounded-2xl bg-(--color-primary)/5 border 
			border-(--color-primary)/10 max-w-md"
		>
			<div className="flex flex-col gap-1">
				<label
					htmlFor="start_date"
					className="text-sm font-semibold text-(--color-text) opacity-90 ml-1"
				>
					{t("plans.start_date")}
				</label>

				<div
					className="flex items-center gap-3 p-3 rounded-xl bg-(--color-bg-nav-footer) 
				border border-(--color-primary)/20 shadow-inner focus-within:border-(--color-primary) transition-colors"
				>
					<FaCalendarAlt className="text-(--color-primary) opacity-70" />
					<input
						id="start_date"
						type="date"
						{...register("start_date")}
						className="bg-transparent text-(--color-text) outline-none w-full cursor-pointer 
						scheme-dark dark:scheme-dark light:[color-scheme:light]"
					/>
				</div>
			</div>

			<div className="flex flex-col gap-1">
				<label
					htmlFor="end_date"
					className="text-sm font-semibold text-(--color-text) opacity-90 ml-1"
				>
					{t("plans.end_date")}
				</label>

				<div
					className="flex items-center gap-3 p-3 rounded-xl bg-(--color-bg-nav-footer) 
				border border-(--color-primary)/20 shadow-inner focus-within:border-(--color-primary) transition-colors"
				>
					<FaCalendarAlt className="text-(--color-primary) opacity-70" />
					<input
						id="end_date"
						type="date"
						{...register("end_date")}
						className="bg-transparent text-(--color-text) outline-none w-full cursor-pointer 
						scheme-dark dark:scheme-dark light:[color-scheme:light]"
					/>
				</div>
			</div>

			{errors.end_date && (
				<p className="text-sm text-(--color-red) font-medium px-2">
					{errors.end_date.message}
				</p>
			)}

			<div className="flex gap-3 mt-2">
				<button
					type="submit"
					disabled={isSaving}
					className="flex-1 px-4 py-2 rounded-xl bg-(--color-primary) text-white font-bold 
					hover:opacity-90 transition disabled:opacity-50"
				>
					{isSaving ? t("plans.saving") : t("plans.save_dates")}
				</button>

				<button
					type="button"
					onClick={onCancel}
					disabled={isSaving}
					className="flex-1 px-4 py-2 rounded-xl border border-(--color-primary)/30 text-(--color-text) 
					opacity-70 hover:opacity-100 transition"
				>
					{t("plans.cancel")}
				</button>
			</div>
		</form>
	);
};

export default TripDatesForm;
