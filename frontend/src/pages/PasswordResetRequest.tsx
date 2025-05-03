import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { requestPasswordResetRequest } from "../services/AuthService";
import * as Yup from "yup";
import bgImage from "../assets/baloon.jpg";

const PasswordResetRequest: React.FC = () => {
	const [message, setMessage] = useState<string | null>(null);

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
					"Лист з інструкціями надіслано на вашу електрону пошту"
				);
				setTimeout(() => navigate("/"), 2000);
			} catch (error: any) {
				setMessage("Сталася помилка. Спробуйте ще раз.");
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
			<div className="max-w-md w-full p-6 bg-white rounded shadow-lg">
				<h2 className="text-2xl font-bold mb-4 text-center">
					Відновлення пароля
				</h2>
				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium"
							htmlFor="email"
						>
							Електронна пошта
						</label>
						<input
							id="email"
							name="email"
							type="email"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.email}
							placeholder="Введіть вашу електронну пошту"
							className="w-full px-3 py-2 border rounded"
						/>
						{formik.touched.email && formik.errors.email && (
							<p className="text-red-500 text-sm mt-1">
								{formik.errors.email}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full py-2 px-4 bg-[#0099A9] text-white rounded hover:bg-[#007f8a]"
					>
						Надіслати листа для зміни пароля
					</button>
				</form>

				{message && (
					<p className="mt-4 text-center text-sm text-blue-600">
						{message}
					</p>
				)}
			</div>
		</div>
	);
};

export default PasswordResetRequest;
