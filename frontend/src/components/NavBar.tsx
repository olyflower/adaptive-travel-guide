import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaTimes, FaBars } from "react-icons/fa";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const { isAuthenticated, logout } = useAuth();

	const toggleMenu = () => {
		setIsOpen(!isOpen);
		if (menuOpen) setMenuOpen(false);
	};

	return (
		<nav className="bg-(--color-bg-nav-footer) px-4 py-4 w-full z-50 top-0 h-auto md:h-37.5">
			<div className="max-w-7xl mx-auto w-full flex items-center justify-between relative flex-wrap h-full">
				<Link to="/" className="flex items-center gap-3 ">
					<img
						src={Logo}
						alt="Logo"
						className="h-10 w-auto md:h-12 dark:brightness-400 dark:saturate-150"
					/>
					<span className="text-lg md:text-xl text-(--color-text) tracking-tight">
						Adaptive{" "}
						<span className="text-(--color-primary)">Travel</span>{" "}
						Guide
					</span>
				</Link>

				<button
					className="md:hidden text-3xl text-(--color-primary) hover:text-(--color-primary-hover) z-10"
					onClick={toggleMenu}
					aria-label={t("nav.menu")}
				>
					{isOpen ? <FaTimes size={36} /> : <FaBars size={36} />}
				</button>

				{/* Mobile Menu Overlay */}
				<div
					className={`${
						isOpen ? "flex" : "hidden"
					} absolute top-full left-0 w-full bg-(--color-bg-nav-footer)/95 backdrop-blur-sm 
          flex-col px-6 py-6 shadow-xl z-50 border-t border-(--color-primary)/10
          md:flex md:flex-row md:static md:w-auto md:items-center md:justify-center md:flex-1 
					md:bg-transparent md:py-0 md:px-0 md:shadow-none md:border-none md:backdrop-blur-none`}
				>
					<ul
						className="flex flex-col text-lg md:flex-row md:space-x-10 font-medium text-center 
					text-(--color-text) w-full justify-center [&_a]:hover:text-(--color-primary)"
					>
						<li>
							<Link to="/" onClick={() => setIsOpen(false)}>
								{t("nav.home")}
							</Link>
						</li>
						<li>
							<Link to="/about" onClick={() => setIsOpen(false)}>
								{t("nav.about")}
							</Link>
						</li>
						<li>
							<Link
								to="/contacts"
								onClick={() => setIsOpen(false)}
							>
								{t("nav.contacts")}
							</Link>
						</li>
					</ul>

					{/* Mobile Dropdown (User Profile) */}
					<div className="mt-6 flex flex-col items-center md:hidden">
						<div className="w-full h-px bg-(--color-primary)/10 mb-6"></div>
						<div className="relative w-full flex flex-col items-center">
							<button
								onClick={() => setMenuOpen(!menuOpen)}
								className="text-(--color-primary) hover:text-(--color-primary-hover) 
								focus:outline-none cursor-pointer transition duration-300"
							>
								<FaUserCircle size={44} />
							</button>
							{menuOpen && (
								<div
									className="mt-4 w-full text-(--color-text) bg-(--color-bg-main) border border-(--color-primary)/10 
								rounded-2xl shadow-lg overflow-hidden"
								>
									{isAuthenticated ? (
										<>
											<Link
												to="/profile"
												className="block px-6 py-3 text-base border-b border-(--color-primary)/5 hover:bg-(--color-primary)/5"
												onClick={() => {
													setMenuOpen(false);
													setIsOpen(false);
												}}
											>
												{t("nav.profile")}
											</Link>
											<Link
												to="/edit-profile"
												className="block px-6 py-3 text-base border-b border-(--color-primary)/5 hover:bg-(--color-primary)/5"
												onClick={() => {
													setMenuOpen(false);
													setIsOpen(false);
												}}
											>
												{t("nav.edit_profile")}
											</Link>
											<button
												onClick={() => {
													logout();
													setMenuOpen(false);
													setIsOpen(false);
												}}
												className="block w-full text-left px-6 py-3 text-base text-(--color-red) hover:bg-(--color-red)/5"
											>
												{t("auth.logout")}
											</button>
										</>
									) : (
										<div className="p-4 space-y-3">
											<Link
												to="/register"
												className="block text-center text-(--color-primary) font-medium hover:underline"
												onClick={() => {
													setMenuOpen(false);
													setIsOpen(false);
												}}
											>
												{t("auth.register")}
											</Link>
											<Link
												to="/login"
												className="block text-center text-(--color-primary) font-medium hover:underline"
												onClick={() => {
													setMenuOpen(false);
													setIsOpen(false);
												}}
											>
												{t("auth.login")}
											</Link>
											<div className="pt-2">
												<GoogleLoginButton />
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Desktop Dropdown */}
				<div className="hidden md:flex items-center relative">
					<div className="relative">
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="text-(--color-primary) hover:text-(--color-primary-hover) focus:outline-none 
							cursor-pointer transition-transform duration-300 active:scale-90"
						>
							<FaUserCircle size={52} />
						</button>

						{menuOpen && (
							<>
								<div
									className="fixed inset-0 z-10"
									onClick={() => setMenuOpen(false)}
								></div>

								<div
									className="absolute right-0 mt-3 w-64 text-(--color-text) bg-(--color-bg-nav-footer) border border-(--color-primary)/10 
								rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200"
								>
									{isAuthenticated ? (
										<div className="py-2">
											<Link
												to="/profile"
												className="block px-6 py-3 text-sm hover:text-(--color-primary-hover)"
												onClick={() =>
													setMenuOpen(false)
												}
											>
												{t("nav.profile")}
											</Link>
											<Link
												to="/edit-profile"
												className="block px-6 py-3 text-sm hover:text-(--color-primary-hover) border-b border-(--color-primary)/5"
												onClick={() =>
													setMenuOpen(false)
												}
											>
												{t("nav.edit_profile")}
											</Link>
											<button
												onClick={() => {
													logout();
													setMenuOpen(false);
												}}
												className="block w-full text-left px-6 py-3 text-sm text-(--color-red) hover:bg-(--color-red)/10 
												transition-colors font-medium"
											>
												{t("auth.logout")}
											</button>
										</div>
									) : (
										<div className="p-4 space-y-3">
											<Link
												to="/register"
												className="btn-primary block text-center py-2 text-sm"
												onClick={() =>
													setMenuOpen(false)
												}
											>
												{t("auth.register")}
											</Link>
											<Link
												to="/login"
												className="block text-center text-(--color-text) text-sm font-medium hover:text-(--color-primary) 
												transition-colors"
												onClick={() =>
													setMenuOpen(false)
												}
											>
												{t("auth.login")}
											</Link>

											<GoogleLoginButton />
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
