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
				await confirmPasswordResetRequest(
					uid,
					token,
					values.new_password
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
							placeholder="Введіть новий пароль"
							className="w-full px-3 py-2 border rounded text-sm"
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
							className="block font-medium"
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
							placeholder="Підтвердіть новий пароль"
							className="w-full px-3 py-2 border rounded text-sm"
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
