import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo_nav.png";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaTimes, FaBars } from "react-icons/fa";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const { isAuthenticated, logout } = useAuth();

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className="bg-[#F0EDF2] px-4 py-4 w-full z-50 top-0 h-auto md:h-[150px]">
			<div className="max-w-screen-xl mx-auto w-full flex items-center justify-between relative flex-wrap h-full">
				<Link to="/" className="flex items-center z-10">
					<img
						src={Logo}
						alt="Adaptive Travel Guide"
						className="h-14 w-auto"
					/>
				</Link>

				<button
					className="md:hidden text-3xl text-[#4A1158] z-10"
					onClick={toggleMenu}
					aria-label="Меню"
				>
					{isOpen ? <FaTimes size={36} /> : <FaBars size={36} />}
				</button>

				<div
					className={`${
						isOpen ? "block" : "hidden"
					} w-full bg-[#F0EDF2] px-6 py-4 flex-col md:flex md:flex-row md:static md:w-auto md:items-center md:justify-center md:flex-1 md:bg-transparent md:py-0 md:px-0`}
				>
					<ul className="flex flex-col text-lg md:flex-row md:space-x-10 font-medium text-center w-full justify-center [&_a]:hover:text-[#4A1158]">
						<li>
							<Link to="/" onClick={() => setIsOpen(false)}>
								Головна
							</Link>
						</li>
						<li>
							<Link to="/about" onClick={() => setIsOpen(false)}>
								Про нас
							</Link>
						</li>
						<li>
							<Link
								to="/contacts"
								onClick={() => setIsOpen(false)}
							>
								Контакти
							</Link>
						</li>
					</ul>

					{/* Mobile Dropdown */}
					<div className="mt-4 border-t pt-4 md:hidden">
						<div className="relative">
							<button
								onClick={() => setMenuOpen(!menuOpen)}
								className="text-2xl text-[#4A1158] hover:text-[#4A1158] transition duration-300"
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
												Профіль
											</Link>
											<Link
												to="/edit-profile"
												className="block px-4 py-2 text-sm"
												onClick={() => {
													setMenuOpen(false);
													setIsOpen(false);
												}}
											>
												Редагувати Профіль
											</Link>
											<button
												onClick={() => {
													logout();
													setMenuOpen(false);
													setIsOpen(false);
												}}
												className="block w-full text-left px-4 py-2 text-sm"
											>
												Вихід
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
												Реєстрація
											</Link>
											<Link
												to="/login"
												className="block px-4 py-2 text-sm"
												onClick={() => {
													setMenuOpen(false);
													setIsOpen(false);
												}}
											>
												Вхід
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
							className="text-2xl text-[#4A1158] focus:outline-none"
						>
							<FaUserCircle
								size={52}
								className={"text-[#4A1158]"}
							/>
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
											Профіль
										</Link>
										<Link
											to="/edit-profile"
											className="block px-2 py-2 text-sm"
											onClick={() => setMenuOpen(false)}
										>
											Редагувати Профіль
										</Link>
										<button
											onClick={() => {
												logout();
												setMenuOpen(false);
											}}
											className="block w-full text-left px-2 py-2 text-sm"
										>
											Вихід
										</button>
									</>
								) : (
									<>
										<Link
											to="/register"
											className="block px-2 py-2 text-sm"
											onClick={() => setMenuOpen(false)}
										>
											Реєстрація
										</Link>
										<Link
											to="/login"
											className="block px-2 py-2 text-sm"
											onClick={() => setMenuOpen(false)}
										>
											Вхід
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
