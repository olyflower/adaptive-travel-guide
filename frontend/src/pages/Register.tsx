import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUserRequest } from "../services/AuthService";
import bgImage from "../assets/hero_main.png";

const Register: React.FC = () => {
	const { t, i18n } = useTranslation();
	const { login } = useAuth();
	const navigate = useNavigate();
	const [message, setMessage] = useState<string | null>(null);

	const getValidationSchema = (t: any) =>
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
		});
	const validationSchema = useMemo(() => getValidationSchema(t), [t]);

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
					values.password
				);
				await login(values.email, values.password);
				navigate("/");
			} catch (error: any) {
				if (error.response && error.response.data) {
					const errors = error.response.data;

					if (errors.email) {
						setMessage("errors.exist_user");
					}
				} else {
					setMessage("errors.general");
				}
			}
		},
	});

	useEffect(() => {
		if (formik.submitCount > 0 || Object.keys(formik.errors).length > 0) {
			formik.validateForm();
		}
	}, [i18n.language]);
	return (
		<>
			<Navbar></Navbar>
			<div
				className="flex items-center justify-center"
				style={{
					backgroundImage: `url(${bgImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="w-[340px] sm:w-[455px] bg-[#F6F0FA] rounded shadow-lg p-6 my-20">
					<h2 className="text-2xl sm:text-3xl font-medium mb-4 text-center">
						{t("auth.register")}
					</h2>

					<form onSubmit={formik.handleSubmit} className="space-y-4 ">
						<div>
							<label
								className="block font-medium"
								htmlFor="email"
							>
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
							<label
								className="block font-medium"
								htmlFor="username"
							>
								{t("auth.username")}
							</label>
							<input
								id="username"
								name="username"
								type="text"
								autoComplete="username"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.username}
								placeholder="mandrivnyk123"
								className="w-full px-3 py-2 border rounded text-sm"
							/>
							{formik.touched.username &&
								formik.errors.username && (
									<p className="text-red-500 text-sm mt-1">
										{formik.errors.username}
									</p>
								)}
						</div>

						<div>
							<label
								className="block font-medium"
								htmlFor="password"
							>
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
							{formik.touched.password &&
								formik.errors.password && (
									<p className="text-red-500 text-sm mt-1">
										{formik.errors.password}
									</p>
								)}
						</div>
						<div>
							<label
								className="block font-medium"
								htmlFor="confirmPassword"
							>
								{t("auth.password_confirm")}
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.confirmPassword}
								placeholder={t("auth.placeholder_confirm")}
								className="w-full px-3 py-2 border rounded text-sm"
							/>
							{formik.touched.confirmPassword &&
								formik.errors.confirmPassword && (
									<p className="text-red-500 text-sm mt-1">
										{formik.errors.confirmPassword}
									</p>
								)}
						</div>

						<button
							type="submit"
							className="py-2 px-4 bg-[#4A1158] text-white rounded-full mt-8 text-base sm:text-lg block mx-auto"
						>
							{t("auth.button_register")}
						</button>
					</form>

					{message && (
						<p className="mt-2 text-center text-sm text-red-500">
							{t(message)}
						</p>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Register;
