import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { confirmPasswordResetRequest } from "../services/AuthService";
import * as Yup from "yup";
import bgImage from "../assets/baloon.jpg";

const PasswordResetConfirm: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [message, setMessage] = useState<string | null>(null);

	const uid = searchParams.get("uid");
	const token = searchParams.get("token");

	const formik = useFormik({
		initialValues: {
			new_password: "",
			confirm_password: "",
		},
		validationSchema: Yup.object({
			new_password: Yup.string()
				.min(8, "Пароль має містити щонайменше 8 символів")
				.required("Це поле є обов’язковим"),
			confirm_password: Yup.string()
				.oneOf([Yup.ref("new_password")], "Паролі не співпадають")
				.required("Це поле є обов’язковим"),
		}),
		onSubmit: async (values) => {
			setMessage(null);

			if (!uid || !token) {
				setMessage("Недійсне посилання.");
				return;
			}

			try {
				await confirmPasswordResetRequest(uid, token, values.new_password);
				setMessage("Пароль успішно змінено. Ви можете увійти.");
				setTimeout(() => navigate("/login"), 2000);
			} catch (error: any) {
				setMessage(
					"Сталась помилка. Посилання недійсне або застаріле."
				);
			}
		},
	});

	useEffect(() => {
		if (!uid || !token) {
			setMessage("Недійсне посилання.");
		}
	}, [uid, token]);

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
					Встановити новий пароль
				</h2>
				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium"
							htmlFor="new_password"
						>
							Новий пароль
						</label>
						<input
							id="new_password"
							name="new_password"
							type="password"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.new_password}
							className="w-full px-3 py-2 border rounded"
							placeholder="Введіть новий пароль"
						/>
						{formik.touched.new_password &&
							formik.errors.new_password && (
								<p className="text-red-500 text-sm mt-1">
									{formik.errors.new_password}
								</p>
							)}
					</div>

					<div>
						<label
							className="block text-sm font-medium"
							htmlFor="confirm_password"
						>
							Підтвердіть пароль
						</label>
						<input
							id="confirm_password"
							name="confirm_password"
							type="password"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.confirm_password}
							className="w-full px-3 py-2 border rounded"
							placeholder="Підтвердіть новий пароль"
						/>
						{formik.touched.confirm_password &&
							formik.errors.confirm_password && (
								<p className="text-red-500 text-sm mt-1">
									{formik.errors.confirm_password}
								</p>
							)}
					</div>

					<button
						type="submit"
						className="w-full py-2 px-4 bg-[#0099A9] text-white rounded hover:bg-[#007f8a]"
					>
						Змінити пароль
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

export default PasswordResetConfirm;
