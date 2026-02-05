import React from "react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";

const Footer: React.FC = () => {
	const { t } = useTranslation();
	return (
		<footer className="bg-(--color-bg-nav-footer) text-(--color-text) py-8 mt-auto shadow-inner">
			<div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-8">
				<div className="hidden md:block">
					<h2 className="text-lg font-bold text-center text-(--color-text) mb-4">
						Adaptive Travel Guide
					</h2>
					<p className="text-lg text-center">{t("footer.text")}</p>
				</div>

				<div className="md:col-span-1 col-span-1">
					<h3 className="text-sm md:text-lg font-semibold text-center text-(--color-text) mb-3">
						{t("footer.navigation")}
					</h3>
					<ul className="space-y-4 text-sm md:text-lg text-center">
						<li>
							<Link
								to="/"
								className="hover:text-(--color-primary-hover)"
							>
								{t("nav.home")}
							</Link>
						</li>
						<li>
							<Link
								to="/about"
								className="hover:text-(--color-primary-hover)"
							>
								{t("nav.about")}
							</Link>
						</li>
						<li>
							<Link
								to="/contacts"
								className="hover:text-(--color-primary-hover)"
							>
								{t("nav.contacts")}
							</Link>
						</li>
					</ul>
				</div>

				<div className="md:col-span-1 col-span-1">
					<h3 className="text-sm md:text-lg font-semibold mb-3 text-center">
						{t("footer.follow")}
					</h3>
					<div className="flex space-x-4 items-center justify-center">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaFacebook
								size={24}
								className="text-(--color-primary) hover:text-(--color-primary-hover)"
							/>
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaInstagram
								size={24}
								className="text-(--color-primary) hover:text-(--color-primary-hover)"
							/>
						</a>
						<a
							href="https://t.me"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaTelegram
								size={24}
								className="text-(--color-primary) hover:text-(--color-primary-hover)"
							/>
						</a>
					</div>

					<div className="flex flex-col items-center gap-4">
						<LanguageSwitcher />
						<ThemeToggle />
					</div>
				</div>
			</div>

			<div className="text-center text-[10px] md:text-sm mt-12">
				&copy; {new Date().getFullYear()} Adaptive Travel Guide.
				{t("footer.rights")}
			</div>
		</footer>
	);
};

export default Footer;
