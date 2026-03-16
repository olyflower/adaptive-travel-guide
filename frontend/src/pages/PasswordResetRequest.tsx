import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { requestPasswordResetRequest } from "../services/AuthService";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import bgImage from "../assets/hero_main.webp";

type ResetRequestValues = {
	email: string;
};

type FieldProps = {
	id: keyof ResetRequestValues;
	label: string;
	type?: string;
	placeholder?: string;
	autoComplete?: string;
};

/**
 * Password Reset Request page component
 * Allows user to request a password reset email by providing their email address
 */
const PasswordResetRequest = () => {
	const { t, i18n } = useTranslation();
	const [message, setMessage] = useState<string | null>(null);
	const [isError, setIsError] = useState<boolean>(false);
	const navigate = useNavigate();

	const validationSchema = useMemo(
		() =>
			Yup.object({
				email: Yup.string()
					.email(t("errors.email_format"))
					.required(t("errors.required")),
			}),
		[t],
	);

	const {
		register,
		handleSubmit,
		trigger,
		formState: { errors, isSubmitted },
	} = useForm<ResetRequestValues>({
		resolver: yupResolver(validationSchema),
		defaultValues: { email: "" },
	});

	useEffect(() => {
		if (isSubmitted) {
			trigger();
		}
	}, [i18n.language, isSubmitted, trigger]);

	/**
 * Handles password reset request form submission
 * Sends email to API to initiate password reset process,
 * shows success or error message, and redirects to home page on success
 * @param values - form values (email)
 */
	const onSubmit = async (values: ResetRequestValues) => {
		setMessage(null);
		try {
			await requestPasswordResetRequest(values.email);
			setMessage("success.email_sent");
			setIsError(false);

			setTimeout(() => navigate("/"), 2000);
		} catch (error: any) {
			const errorKey =
				error.response?.status === 404
					? "errors.no_user"
					: "errors.general";
			setMessage(errorKey);
			setIsError(true);
		}
	};

	/**
 * Renders a single input field with label, error message, and styling
 */
	const renderField = ({
		id,
		label,
		type = "text",
		placeholder = "",
		autoComplete = "off",
	}: FieldProps) => (
		<div className="flex flex-col">
			<label
				className="block mb-1 font-medium text-(--color-text)"
				htmlFor={id}
			>
				{label}
			</label>
			<input
				id={id}
				type={type}
				{...register(id)}
				placeholder={placeholder}
				autoComplete={autoComplete}
				className="w-full px-4 py-2 border border-(--color-primary)/20 rounded-xl text-sm 
                   bg-(--color-bg-main) text-(--color-text) 
                   focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all"
			/>
			{errors[id] && (
				<p className="text-(--color-red) text-xs mt-1 ml-1">
					{errors[id]?.message}
				</p>
			)}
		</div>
	);

	return (
		<div
			className="flex items-center justify-center min-h-screen p-4"
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundAttachment: "fixed",
			}}
		>
			<div
				className="relative z-10 w-full max-w-md bg-(--color-bg-nav-footer) rounded-3xl shadow-2xl 
      p-8 my-10 transition-colors duration-300"
			>
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-(--color-text)">
					{t("auth.reset_request")}
				</h2>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6 text-(--color-text)"
				>
					{renderField({
						id: "email",
						label: t("auth.email"),
						type: "email",
						placeholder: "you@example.com",
						autoComplete: "email",
					})}

					<div className="flex justify-center">
						<button
							type="submit"
							className="btn-primary w-full sm:w-auto px-10"
						>
							{t("auth.reset_request_button")}
						</button>
					</div>
				</form>
				{message && (
					<p
						className={`mt-4 text-center text-sm font-medium ${
							isError
								? "text-(--color-red)"
								: "text-(--color-blue)"
						}`}
					>
						{t(message)}
					</p>
				)}
			</div>
		</div>
	);
};

export default PasswordResetRequest;
