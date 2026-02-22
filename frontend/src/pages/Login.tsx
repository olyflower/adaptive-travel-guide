import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import bgImage from "../assets/hero_main.webp";

type LoginFormValues = {
	email: string;
	password: string;
};

type FieldProps = {
	id: keyof LoginFormValues;
	label: string;
	type?: string;
	placeholder?: string;
	autoComplete?: string;
};

const Login = () => {
	const { t, i18n } = useTranslation();
	const { login } = useAuth();
	const navigate = useNavigate();
	const [message, setMessage] = useState<string | null>(null);

	const validationSchema = useMemo(
		() =>
			Yup.object({
				email: Yup.string()
					.email(t("errors.email_format"))
					.required(t("errors.required")),
				password: Yup.string().required(t("errors.required")),
			}),
		[t],
	);

	const {
		register,
		handleSubmit,
		trigger,
		formState: { errors, isSubmitted },
	} = useForm<LoginFormValues>({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (isSubmitted) {
			trigger();
		}
	}, [i18n.language, isSubmitted, trigger]);

	const onSubmit = async (values: LoginFormValues) => {
		setMessage(null);
		try {
			await login(values.email, values.password);
			navigate("/");
		} catch (error: any) {
			const errorKey = error.response?.data
				? "errors.wrong_email_password"
				: "errors.general";
			setMessage(errorKey);
		}
	};

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
					{t("auth.login")}
				</h2>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4 text-(--color-text)"
				>
					{renderField({
						id: "email",
						label: t("auth.email"),
						type: "email",
						placeholder: "you@example.com",
						autoComplete: "email",
					})}
					{renderField({
						id: "password",
						label: t("auth.password"),
						type: "password",
						placeholder: t("auth.placeholder"),
						autoComplete: "current-password",
					})}

					<div className="flex justify-center pt-4">
						<button
							type="submit"
							className="btn-primary w-full sm:w-auto px-12"
						>
							{t("auth.submit_button")}
						</button>
					</div>
				</form>

				<div className="mt-4 flex flex-col items-center space-y-2">
					<Link
						to="/forgot-password"
						className="text-(--color-text) hover:underline hover:decoration-(--color-primary-hover) transition-all"
					>
						{t("auth.forgot_password")}
					</Link>
				</div>

				{message && (
					<p className="mt-4 text-center text-sm text-(--color-red) font-medium">
						{t(message)}
					</p>
				)}
			</div>
		</div>
	);
};

export default Login;
