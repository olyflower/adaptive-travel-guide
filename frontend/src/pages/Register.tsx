import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUserRequest } from "../services/AuthService";
import { useRevalidateOnLangChange } from "../hooks/useRevalidateOnLangChange";
import bgImage from "../assets/hero_main.png";

const Register = () => {
	const { t } = useTranslation();
	const { login } = useAuth();
	const navigate = useNavigate();
	const [message, setMessage] = useState<string | null>(null);

	const validationSchema = useMemo(
		() =>
			Yup.object({
				email: Yup.string()
					.email(t("errors.email_format"))
					.required(t("errors.required")),
				username: Yup.string()
					.min(3, t("errors.min_username"))
					.required(t("errors.required")),
				password: Yup.string()
					.min(8, t("errors.min_password"))
					.required(t("errors.required")),
				confirmPassword: Yup.string()
					.oneOf([Yup.ref("password")], t("errors.password_mismatch"))
					.required(t("errors.required")),
			}),
		[t],
	);

	const formik = useFormik({
		initialValues: {
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema,
		onSubmit: async (values) => {
			setMessage(null);
			try {
				await registerUserRequest(
					values.email,
					values.username,
					values.password,
				);
				await login(values.email, values.password);
				navigate("/");
			} catch (error: any) {
				const errorKey = error.response?.data?.email
					? "errors.exist_user"
					: "errors.general";
				setMessage(errorKey);
			}
		},
	});

	useRevalidateOnLangChange(formik);

	const renderField = (
		id: string,
		label: string,
		type: string = "text",
		placeholder: string,
		autoComplete: string = "off",
	) => (
		<div className="flex flex-col">
			<label className="block mb-1 font-medium" htmlFor={id}>
				{label}
			</label>
			<input
				id={id}
				type={type}
				{...formik.getFieldProps(id)}
				placeholder={placeholder}
				autoComplete={autoComplete}
				className="w-full px-4 py-2 border border-(--color-primary)/20 rounded-xl text-sm 
                   bg-(--color-bg-main) text-(--color-text) 
                   focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all"
			/>
			{formik.touched[id as keyof typeof formik.values] &&
				formik.errors[id as keyof typeof formik.values] && (
					<p className="text-(--color-red) text-xs mt-1 ml-1">
						{
							formik.errors[
								id as keyof typeof formik.values
							] as string
						}
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
			}}
		>
			<div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

			<div
				className="relative z-10 w-full max-w-md bg-(--color-bg-nav-footer) rounded-3xl shadow-2xl 
			p-8 my-10 transition-colors duration-300"
			>
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-(--color-text)">
					{t("auth.register")}
				</h2>

				<form
					onSubmit={formik.handleSubmit}
					className="space-y-4 text-(--color-text)"
				>
					{renderField(
						"email",
						t("auth.email"),
						"email",
						"you@example.com",
					)}
					{renderField(
						"username",
						t("auth.username"),
						"text",
						"mandrivnyk123",
					)}
					{renderField(
						"password",
						t("auth.password"),
						"password",
						t("auth.placeholder"),
					)}
					{renderField(
						"confirmPassword",
						t("auth.password_confirm"),
						"password",
						t("auth.placeholder_confirm"),
					)}

					<div className="flex justify-center pt-4">
						<button
							type="submit"
							className="btn-primary w-full sm:w-auto px-12"
						>
							{t("auth.button_register")}
						</button>
					</div>
				</form>

				{message && (
					<p className="mt-4 text-center text-sm text-(--color-red) font-medium">
						{t(message)}
					</p>
				)}
			</div>
		</div>
	);
};

export default Register;
