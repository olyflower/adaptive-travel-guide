import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { useRevalidateOnLangChange } from "../hooks/useRevalidateOnLangChange";
import * as Yup from "yup";
import bgImage from "../assets/hero_main.png";

const Login: React.FC = () => {
	const { t } = useTranslation();
	const { login } = useAuth();
	const navigate = useNavigate();
	const [message, setMessage] = useState<string | null>(null);

	const getValidationSchema = (t: TFunction) =>
		Yup.object({
			email: Yup.string()
				.email(t("errors.email_format"))
				.required(t("errors.required")),
			password: Yup.string().required(t("errors.required")),
		});

	const validationSchema = useMemo(() => getValidationSchema(t), [t]);

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema,
		onSubmit: async (values) => {
			setMessage(null);

			try {
				await login(values.email, values.password);
				navigate("/");
			} catch (error: any) {
				if (error.response && error.response.data) {
					setMessage("errors.wrong_email_password");
				} else {
					setMessage("errors.general");
				}
			}
		},
	});

	useRevalidateOnLangChange(formik);

	return (
		<div
			className="flex items-center justify-center"
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="w-[340px] sm:w-[455px] bg-[var(--color-bg-main)] rounded shadow-lg p-6 my-20">
				<h2 className="text-2xl sm:text-3xl font-medium mb-4 text-center">
					{t("auth.login")}
				</h2>
				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<div>
						<label className="block font-medium" htmlFor="email">
							{t("auth.email")}
						</label>
						<input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.email}
							placeholder="you@example.com"
							className="w-full px-3 py-2 border rounded text-sm"
						/>
						{formik.touched.email && formik.errors.email && (
							<p className="text-red-500 text-sm mt-1">
								{formik.errors.email}
							</p>
						)}
					</div>

					<div>
						<label className="block font-medium" htmlFor="password">
							{t("auth.password")}
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="new-password"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.password}
							placeholder={t("auth.placeholder")}
							className="w-full px-3 py-2 border rounded text-sm"
						/>
						{formik.touched.password && formik.errors.password && (
							<p className="text-red-500 text-sm mt-1">
								{formik.errors.password}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="py-2 px-4 bg-[var(--color-purple)] hover:bg-[var(--color-purple-hover)] text-white rounded-full mt-12 text-base sm:text-lg block mx-auto w-[125px] sm:w-[190px]"
					>
						{t("auth.submit_button")}
					</button>
				</form>

				<div className="mt-4 flex flex-col items-center space-y-2">
					<Link
						to="/forgot-password"
						className="hover:underline hover:decoration-[var(--color-purple)]"
					>
						{t("auth.forgot_password")}
					</Link>
				</div>

				{message && (
					<p className="mt-2 text-center text-sm text-red-500">
						{t(message)}
					</p>
				)}
			</div>
		</div>
	);
};

export default Login;
