import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo_nav.png";
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
	};

	return (
		<nav className="bg-[var(--color-bg)] px-4 py-4 w-full z-50 top-0 h-auto md:h-[150px]">
			<div className="max-w-screen-xl mx-auto w-full flex items-center justify-between relative flex-wrap h-full">
				<Link to="/" className="flex items-center z-10">
					<img
						src={Logo}
						alt="Adaptive Travel Guide"
						className="h-14 w-auto"
					/>
				</Link>

				<button
					className="md:hidden text-3xl text-[var(--color-purple)] hover:text-[var(--color-purple-hover)] z-10"
					onClick={toggleMenu}
					aria-label={t("nav.menu")}
				>
					{isOpen ? <FaTimes size={36} /> : <FaBars size={36} />}
				</button>

				<div
					className={`${
						isOpen ? "block" : "hidden"
					} w-full bg-[var(--color-bg)] px-6 py-4 flex-col md:flex md:flex-row md:static md:w-auto md:items-center md:justify-center md:flex-1 md:bg-transparent md:py-0 md:px-0`}
				>
					<ul className="flex flex-col text-lg md:flex-row md:space-x-10 font-medium text-center w-full justify-center [&_a]:hover:text-[var(--color-purple)]">
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

					{/* Mobile Dropdown */}
					<div className="mt-4 border-t pt-4 md:hidden">
						<div className="relative">
							<button
								onClick={() => setMenuOpen(!menuOpen)}
								className="text-[var(--color-purple)] hover:text-[var(--color-purple-hover)] focus:outline-none cursor-pointer transition duration-300"
							>
								<FaUserCircle size={36} />
							</button>
							{menuOpen && (
								<div className="mt-2 w-full bg-white rounded shadow-md z-20">
									{isAuthenticated ? (
										<>
											<Link
												to="/profile"
												className="block px-4 py-2 text-sm"
												onClick={() => {
													setMenuOpen(false);
													setIsOpen(false);
												}}
											>
												{t("nav.profile")}
											</Link>
											<Link
												to="/edit-profile"
												className="block px-4 py-2 text-sm"
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
												className="block w-full text-left px-4 py-2 text-sm"
											>
												{t("auth.logout")}
											</button>
										</>
									) : (
										<>
											<Link
												to="/register"
												className="block px-4 py-2 text-sm"
												onClick={() => {
													setMenuOpen(false);
													setIsOpen(false);
												}}
											>
												{t("auth.register")}
											</Link>
											<Link
												to="/login"
												className="block px-4 py-2 text-sm"
												onClick={() => {
													setMenuOpen(false);
													setIsOpen(false);
												}}
											>
												{t("auth.login")}
											</Link>
											<div className="px-4 py-2">
												<GoogleLoginButton />
											</div>
										</>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Desktop Dropdown */}
				<div className="hidden md:flex items-center relative">
					<div>
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="text-[var(--color-purple)] hover:text-[var(--color-purple-hover)] focus:outline-none cursor-pointer transition duration-300"
						>
							<FaUserCircle size={52} />
						</button>
						{menuOpen && (
							<div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-md z-20">
								{isAuthenticated ? (
									<>
										<Link
											to="/profile"
											className="block px-2 py-2 text-sm"
											onClick={() => setMenuOpen(false)}
										>
											{t("nav.profile")}
										</Link>
										<Link
											to="/edit-profile"
											className="block px-2 py-2 text-sm"
											onClick={() => setMenuOpen(false)}
										>
											{t("nav.edit_profile")}
										</Link>
										<button
											onClick={() => {
												logout();
												setMenuOpen(false);
											}}
											className="block w-full text-left px-2 py-2 text-sm"
										>
											{t("auth.logout")}
										</button>
									</>
								) : (
									<>
										<Link
											to="/register"
											className="block px-2 py-2 text-sm"
											onClick={() => setMenuOpen(false)}
										>
											{t("auth.register")}
										</Link>
										<Link
											to="/login"
											className="block px-2 py-2 text-sm"
											onClick={() => setMenuOpen(false)}
										>
											{t("auth.login")}
										</Link>
										<div className="px-2 py-2">
											<GoogleLoginButton />
										</div>
									</>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
