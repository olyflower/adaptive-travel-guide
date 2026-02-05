import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { confirmPasswordResetRequest } from "../services/AuthService";
import { useTranslation } from "react-i18next";
import { useRevalidateOnLangChange } from "../hooks/useRevalidateOnLangChange";
import * as Yup from "yup";
import bgImage from "../assets/hero_main.png";

const PasswordResetConfirm: React.FC = () => {
	const { t } = useTranslation();
	const [message, setMessage] = useState<string | null>(null);
	const [isError, setIsError] = useState<boolean>(false);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const uid = searchParams.get("uid");
	const token = searchParams.get("token");

	useEffect(() => {
		if (!uid || !token) {
			setMessage("errors.invalid_link");
			setIsError(true);
		}
	}, [uid, token]);

	const validationSchema = useMemo(
		() =>
			Yup.object({
				newPassword: Yup.string()
					.min(8, t("errors.min_password"))
					.required(t("errors.required")),
				confirmPassword: Yup.string()
					.oneOf(
						[Yup.ref("newPassword")],
						t("errors.password_mismatch"),
					)
					.required(t("errors.required")),
			}),
		[t],
	);

	const formik = useFormik({
		initialValues: { newPassword: "", confirmPassword: "" },
		validationSchema,
		onSubmit: async (values) => {
			setMessage(null);
			if (!uid || !token) {
				setMessage("errors.invalid_link");
				setIsError(true);
				return;
			}

			try {
				await confirmPasswordResetRequest(
					uid,
					token,
					values.newPassword,
				);
				setMessage("success.email_change");
				setIsError(false);
				setTimeout(() => navigate("/login"), 2000);
			} catch (error: any) {
				const errorKey =
					error.response?.status === 400
						? "errors.invalid_link"
						: "errors.general";
				setMessage(errorKey);
				setIsError(true);
			}
		},
	});

	useRevalidateOnLangChange(formik);

	const renderField = (
		id: string,
		label: string,
		type: string,
		placeholder: string,
		autoComplete: string = "off"
	) => (
		<div className="flex flex-col text-(--color-text)">
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

			<div className="relative z-10 w-full max-w-md bg-(--color-bg-nav-footer) rounded-3xl shadow-2xl 
			p-8 my-10 transition-colors duration-300">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-(--color-text)">
					{t("auth.reset_confirm")}
				</h2>

				<form onSubmit={formik.handleSubmit} className="space-y-4">
					{renderField(
						"newPassword",
						t("auth.new_password"),
						"password",
						t("auth.placeholder"),
					)}
					{renderField(
						"confirmPassword",
						t("auth.password_confirm"),
						"password",
						t("auth.placeholder_new_confirm"),
					)}

					<div className="flex justify-center pt-4">
						<button
							type="submit"
							className="btn-primary w-full sm:w-auto px-10 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={!uid || !token}
						>
							{t("auth.reset_confirm_button")}
						</button>
					</div>
				</form>

				{message && (
					<p
						className={`mt-4 text-center text-sm font-medium ${isError ? "text-(--color-red)" : "text-(--color-blue)"}`}
					>
						{t(message)}
					</p>
				)}
			</div>
		</div>
	);
};

export default PasswordResetConfirm;
