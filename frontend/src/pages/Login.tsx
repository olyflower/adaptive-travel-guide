import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";
import * as Yup from "yup";
import bgImage from "../assets/hero_main.png";

const Login: React.FC = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [message, setMessage] = useState<string | null>(null);

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Невірний формат електронної пошти")
				.required("Це поле є обов’язковим"),
			password: Yup.string().required("Це поле є обов’язковим"),
		}),
		onSubmit: async (values) => {
			setMessage(null);

			try {
				await login(values.email, values.password);
				navigate("/");
			} catch (error: any) {
				if (error.response && error.response.data) {
					setMessage(
						"Невірний email або пароль. Перевірте введені дані."
					);
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
					Вхід
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
							placeholder="введіть пароль"
							className="w-full px-3 py-2 border rounded text-sm"
						/>
						{formik.touched.password && formik.errors.password && (
							<p className="text-red-500 text-sm mt-1">
								{formik.errors.password}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="py-2 px-4 bg-[#4A1158] text-white rounded-full mt-12 text-base sm:text-lg block mx-auto w-[125px] sm:w-[190px]"
					>
						Увійти
					</button>
				</form>

				<div className="mt-4 flex flex-col items-center space-y-2">
					<Link
						to="/forgot-password"
						className="hover:underline hover:decoration-[#4A1158]"
					>
						Забули пароль?
					</Link>
				</div>

				{message && (
					<p className="mt-2 text-center text-sm">{message}</p>
				)}
			</div>
		</div>
	);
};

export default Login;
