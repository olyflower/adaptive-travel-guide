import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { requestPasswordResetRequest } from "../services/AuthService";
import * as Yup from "yup";
import bgImage from "../assets/hero_main.png";

const PasswordResetRequest: React.FC = () => {
	const [message, setMessage] = useState<string | null>(null);
	const [isError, setIsError] = useState<boolean>(false);
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Невірний формат електронної пошти")
				.required("Це поле є обов’язковим"),
		}),
		onSubmit: async (values) => {
			setMessage(null);
			try {
				await requestPasswordResetRequest(values.email);
				setMessage(
					"Лист з інструкціями надіслано на вашу електронну пошту."
				);
				setIsError(false);
				setTimeout(() => navigate("/"), 2000);
			} catch (error: any) {
				setMessage(
					"Користувача з такою поштою не існує. Введіть дійсну електронну пошту."
				);
				setIsError(true);
			}
		},
	});

	return (
		<div
			className="min-h-screen flex items-center justify-center"
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="w-[340px] sm:w-[450px] bg-[#F6F0FA] rounded shadow-lg p-6">
				<h2 className="text-2xl sm:text-3xl font-medium mb-4 text-center">
					Запит на зміну пароля
				</h2>
				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<div>
						<label className="block font-medium" htmlFor="email">
							Електронна пошта
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
						Надіслати листа для зміни пароля
					</button>
				</form>

				{message && (
					<p
						className={`mt-2 text-center text-sm ${
							isError ? "text-red-500" : "text-blue-700"
						}`}
					>
						{message}
					</p>
				)}
			</div>
		</div>
	);
};

export default PasswordResetRequest;
