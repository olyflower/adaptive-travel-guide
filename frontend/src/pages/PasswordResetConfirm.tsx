import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { confirmPasswordResetRequest } from "../services/AuthService";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import bgImage from "../assets/hero_main.png";

const PasswordResetConfirm: React.FC = () => {
	const { t, i18n } = useTranslation();
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

	const getValidationSchema = (t: any) =>
		Yup.object({
			newPassword: Yup.string()
				.min(8, t("errors.min_password"))
				.required(t("errors.required")),
			confirmPassword: Yup.string()
				.oneOf([Yup.ref("newPassword")], t("errors.password_mismatch"))
				.required(t("errors.required")),
		});

	const validationSchema = useMemo(() => getValidationSchema(t), [t]);

	const formik = useFormik({
		initialValues: {
			newPassword: "",
			confirmPassword: "",
		},
		validationSchema,
		onSubmit: async (values) => {
			setMessage(null);

			if (!uid || !token) {
				setMessage("errors.invalid_link");
				return;
			}

			try {
				await confirmPasswordResetRequest(
					uid,
					token,
					values.newPassword
				);
				setMessage("success.email_change");
				setIsError(false);
				setTimeout(() => navigate("/login"), 2000);
			} catch (error: any) {
				if (error.response?.status === 400) {
					setMessage("errors.invalid_link");
				} else {
					setMessage("errors.general");
				}
				setIsError(true);
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
			<Navbar />
			<div
				className="flex items-center justify-center"
				style={{
					backgroundImage: `url(${bgImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="w-[340px] sm:w-[450px] bg-[#F6F0FA] rounded shadow-lg p-6 my-26">
					<h2 className="text-2xl sm:text-3xl font-medium mb-4 text-center">
						{t("auth.reset_confirm")}
					</h2>
					<form onSubmit={formik.handleSubmit} className="space-y-4">
						<div>
							<label
								className="block font-medium"
								htmlFor="newPassword"
							>
								{t("auth.new_password")}
							</label>
							<input
								id="newPassword"
								name="newPassword"
								type="password"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.newPassword}
								placeholder={t("auth.placeholder")}
								className="w-full px-3 py-2 border rounded text-sm"
							/>
							{formik.touched.newPassword &&
								formik.errors.newPassword && (
									<p className="text-red-500 text-sm mt-1">
										{formik.errors.newPassword}
									</p>
								)}
						</div>

						<div>
							<label
								className="block font-medium"
								htmlFor="confirmPassword"
							>
								{t("auth.placeholder_confirm")}
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.confirmPassword}
								placeholder={t("auth.placeholder_new_confirm")}
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
							className="block mx-auto mt-10 bg-[#4A1158] text-white rounded-full text-base sm:text-lg w-[157px] sm:w-[176px] h-[42px]"
						>
							{t("auth.reset_confirm_button")}
						</button>
					</form>

					{message && (
						<p
							className={`mt-2 text-center text-sm ${
								isError ? "text-red-500" : "text-blue-700"
							}`}
						>
							{t(message)}
						</p>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default PasswordResetConfirm;
