import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { confirmPasswordResetRequest } from "../services/AuthService";
import * as Yup from "yup";
import bgImage from "../assets/hero_main.png";

const PasswordResetConfirm: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [message, setMessage] = useState<string | null>(null);

	const uid = searchParams.get("uid");
	const token = searchParams.get("token");

	const formik = useFormik({
		initialValues: {
			newPassword: "",
			confirmPassword: "",
		},
		validationSchema: Yup.object({
			newPassword: Yup.string()
				.min(8, "Пароль має містити щонайменше 8 символів")
				.required("Це поле є обов’язковим"),
			confirmPassword: Yup.string()
				.oneOf([Yup.ref("newPassword")], "Паролі не співпадають")
				.required("Це поле є обов’язковим"),
		}),
		onSubmit: async (values) => {
			setMessage(null);

			if (!uid || !token) {
				setMessage("Недійсне посилання.");
				return;
			}

			try {
				await confirmPasswordResetRequest(
					uid,
					token,
					values.newPassword
				);
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
			<div className="w-[340px] sm:w-[450px] bg-[#F6F0FA] rounded shadow-lg p-6">
				<h2 className="text-2xl sm:text-3xl font-medium mb-4 text-center">
					Встановити новий пароль
				</h2>
				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<div>
						<label
							className="block font-medium"
							htmlFor="newPassword"
						>
							Новий пароль
						</label>
						<input
							id="newPassword"
							name="newPassword"
							type="password"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.newPassword}
							placeholder="Введіть новий пароль"
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
							Підтвердіть пароль
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.confirmPassword}
							placeholder="Підтвердіть новий пароль"
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
						Змінити пароль
					</button>
				</form>

				{message && (
					<p className="mt-2 text-center text-sm">{message}</p>
				)}
			</div>
		</div>
	);
};

export default PasswordResetConfirm;
