import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { requestPasswordResetRequest } from "../services/AuthService";
import { useTranslation } from "react-i18next";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import * as Yup from "yup";
import bgImage from "../assets/hero_main.png";

const PasswordResetRequest: React.FC = () => {
	const { t, i18n } = useTranslation();
	const [message, setMessage] = useState<string | null>(null);
	const [isError, setIsError] = useState<boolean>(false);
	const navigate = useNavigate();

	const getValidationSchema = (t: any) =>
		Yup.object({
			email: Yup.string()
				.email(t("errors.email_format"))
				.required(t("errors.required")),
		});
	const validationSchema = useMemo(() => getValidationSchema(t), [t]);

	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema,
		onSubmit: async (values) => {
			setMessage(null);
			try {
				await requestPasswordResetRequest(values.email);
				setMessage("success.email_sent");
				setIsError(false);
				setTimeout(() => navigate("/"), 2000);
			} catch (error: any) {
				if (error.response && error.response.status === 404) {
					setMessage("errors.no_user");
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
						{t("auth.reset_request")}
					</h2>
					<form onSubmit={formik.handleSubmit} className="space-y-4">
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

						<button
							type="submit"
							className="py-2 px-4 bg-[#4A1158] text-white rounded-full mt-6 text-base sm:text-lg block mx-auto"
						>
							{t("auth.reset_request_button")}
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

export default PasswordResetRequest;
