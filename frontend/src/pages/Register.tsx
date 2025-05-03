import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUserRequest } from "../services/AuthService";
import bgImage from "../assets/baloon.jpg";
import { FcGoogle } from "react-icons/fc";

const Register: React.FC = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [message, setMessage] = useState<string | null>(null);

	const formik = useFormik({
		initialValues: {
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Введіть коректну електронну пошту")
				.required("Це поле є обов’язковим"),
			username: Yup.string()
				.min(3, "Мінімум 3 символи")
				.required("Це поле є обов’язковим"),
			password: Yup.string()
				.min(6, "Пароль має містити щонайменше 6 символів")
				.required("Це поле є обов’язковим"),
			confirmPassword: Yup.string()
				.oneOf([Yup.ref("password")], "Паролі не збігаються")
				.required("Підтвердіть пароль"),
		}),

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
					setMessage(JSON.stringify(error.response.data));
				} else {
					setMessage("Сталася помилка. Спробуйте ще раз.");
				}
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
					Реєстрація
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
							autoComplete="email"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.email}
							placeholder="Введіть email"
							className="w-full px-3 py-2 border rounded"
						/>
						{formik.touched.email && formik.errors.email && (
							<p className="text-red-500 text-sm mt-1">
								{formik.errors.email}
							</p>
						)}
					</div>

					<div>
						<label
							className="block text-sm font-medium"
							htmlFor="username"
						>
							Ім’я користувача
						</label>
						<input
							id="username"
							name="username"
							type="text"
							autoComplete="username"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.username}
							placeholder="Введіть ім’я користувача"
							className="w-full px-3 py-2 border rounded"
						/>
						{formik.touched.username && formik.errors.username && (
							<p className="text-red-500 text-sm mt-1">
								{formik.errors.username}
							</p>
						)}
					</div>

					<div>
						<label
							className="block text-sm font-medium"
							htmlFor="password"
						>
							Пароль
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="new-password"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.password}
							placeholder="Введіть пароль"
							className="w-full px-3 py-2 border rounded"
						/>
						{formik.touched.password && formik.errors.password && (
							<p className="text-red-500 text-sm mt-1">
								{formik.errors.password}
							</p>
						)}
					</div>
					<div>
						<label
							className="block text-sm font-medium"
							htmlFor="confirmPassword"
						>
							Підтвердження пароля
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							autoComplete="new-password"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.confirmPassword}
							placeholder="Повторіть пароль"
							className="w-full px-3 py-2 border rounded"
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
						className="w-full py-2 px-4 bg-[#0099A9] text-white rounded hover:bg-[#007f8a]"
					>
						Зареєструватися
					</button>
				</form>
				<div className="mt-4 flex flex-col items-center space-y-2">
					<button
						type="button"
						className="w-full py-2 px-4 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-100"
						onClick={() => {}}
					>
						<FcGoogle size={20} />
						<span>Реєстрація через Google</span>
					</button>
				</div>

				{message && (
					<p className="mt-4 text-center text-sm text-red-600">
						{message}
					</p>
				)}
			</div>
		</div>
	);
};

export default Register;
