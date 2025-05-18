import React from "react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";

const Footer: React.FC = () => {
	return (
		<footer className="bg-[#F0EDF2] py-8 mt-auto shadow-inner">
			<div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-8">
				<div className="hidden md:block">
					<h2 className="text-xl font-bold text-center mb-4">
						Adaptive Travel Guide
					</h2>
					<p className="text-sm text-center">
						Адаптивний гід для мандрівників — знаходьте нові місця,
						плануйте поїздки, отримуйте рекомендації на основі ваших
						уподобань.
					</p>
				</div>

				<div className="md:col-span-1 col-span-1">
					<h3 className="text-sm md:text-lg font-semibold text-center mb-3">
						Навігація
					</h3>
					<ul className="space-y-2 text-sm text-center">
						<li>
							<Link to="/" className="hover:text-[#4A1158]">
								Головна
							</Link>
						</li>
						<li>
							<Link to="/about" className="hover:text-[#4A1158]">
								Про нас
							</Link>
						</li>
						<li>
							<Link
								to="/contacts"
								className="hover:text-[#4A1158]"
							>
								Контакти
							</Link>
						</li>
					</ul>
				</div>

				<div className="md:col-span-1 col-span-1">
					<h3 className="text-sm md:text-lg font-semibold mb-3 text-center">
						Слідкуйте за нами
					</h3>
					<div className="flex space-x-4 items-center justify-center">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaFacebook size={24} color="#4A1158" />
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaInstagram size={24} color="#4A1158" />
						</a>
						<a
							href="https://t.me"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaTelegram size={24} color="#4A1158" />
						</a>
					</div>
					<LanguageSwitcher />
				</div>
			</div>

			<div className="text-center text-[8px] md:text-[10px] mt-8">
				&copy; {new Date().getFullYear()} Adaptive Travel Guide. Всі
				права захищено.
			</div>
		</footer>
	);
};

export default Footer;
