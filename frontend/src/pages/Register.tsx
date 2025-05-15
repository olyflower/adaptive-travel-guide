import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUserRequest } from "../services/AuthService";
import bgImage from "../assets/hero_main.png";

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
			<div className="w-[340px] sm:w-[455px] bg-[#F6F0FA] rounded shadow-lg p-6">
				<h2 className="text-2xl sm:text-3xl font-medium mb-4 text-center">
					Реєстрація
				</h2>

				<form onSubmit={formik.handleSubmit} className="space-y-4 ">
					<div>
						<label className="block font-medium" htmlFor="email">
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
						<label className="block font-medium" htmlFor="username">
							Ім’я
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
						{formik.touched.username && formik.errors.username && (
							<p className="text-red-500 text-sm mt-1">
								{formik.errors.username}
							</p>
						)}
					</div>

					<div>
						<label className="block font-medium" htmlFor="password">
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
							placeholder="пароль не менше ніж 6 символів"
							className="w-full px-3 py-2 border rounded text-sm"
						/>
						{formik.touched.password && formik.errors.password && (
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
							placeholder="введіть пароль ще раз"
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
						Зареєструватися
					</button>
				</form>

				{message && (
					<p className="mt-2 text-center text-sm">{message}</p>
				)}
			</div>
		</div>
	);
};

export default Register;
