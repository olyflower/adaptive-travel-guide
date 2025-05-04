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
		<nav className="bg-white shadow-md px-4 py-4">
			<div className="max-w-screen-xl mx-auto w-full flex items-center justify-between relative flex-wrap">
				<Link to="/" className="flex items-center z-10">
					<img src={Logo} alt="MyLogo" className="h-12 w-auto" />
				</Link>

				<button
					className="md:hidden text-3xl text-[#0099A9] z-10"
					onClick={toggleMenu}
					aria-label="Меню"
				>
					{isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
				</button>

				<div
					className={`${
						isOpen ? "flex" : "hidden"
					} absolute top-20 left-0 w-full bg-white px-6 py-4 flex-col md:flex md:flex-row md:static md:w-auto md:items-center md:justify-center md:flex-1 md:bg-transparent md:py-0 md:px-0`}
				>
					<ul className="flex flex-col  text-lg md:flex-row md:space-x-6 font-medium text-center md:text-center w-full justify-center">
						<li>
							<Link
								to="/"
								className="hover:text-[#0099A9]"
								onClick={() => setIsOpen(false)}
							>
								Головна
							</Link>
						</li>
						<li>
							<Link
								to="/about"
								className="hover:text-[#0099A9]"
								onClick={() => setIsOpen(false)}
							>
								Про нас
							</Link>
						</li>
						<li>
							<Link
								to="/contacts"
								className="hover:text-[#0099A9]"
								onClick={() => setIsOpen(false)}
							>
								Контакти
							</Link>
						</li>
					</ul>

					{/* mobile */}
					<div className="mt-4 border-t pt-4 md:hidden">
						{isAuthenticated ? (
							<>
								<Link
									to="/profile"
									className="block px-4 py-2 text-sm hover:bg-gray-100"
									onClick={() => setIsOpen(false)}
								>
									Профайл
								</Link>
								<Link
									to="/edit-profile"
									className="block px-4 py-2 text-sm hover:bg-gray-100"
									onClick={() => setIsOpen(false)}
								>
									Редагувати Профайл
								</Link>
								<button
									onClick={() => {
										logout();
										setIsOpen(false);
									}}
									className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
								>
									Вихід
								</button>
							</>
						) : (
							<>
								<Link
									to="/register"
									className="block px-4 py-2 text-sm hover:bg-gray-100"
									onClick={() => setIsOpen(false)}
								>
									Реєстрація
								</Link>
								<Link
									to="/login"
									className="block px-4 py-2 text-sm hover:bg-gray-100"
									onClick={() => setIsOpen(false)}
								>
									Логін
								</Link>
								<GoogleLoginButton />
							</>
						)}
					</div>
				</div>

				{/* desktop */}
				<div className="hidden md:flex items-center space-x-4 relative">
					{isAuthenticated ? (
						<div className="relative">
							<button
								onClick={() => setMenuOpen(!menuOpen)}
								className="text-2xl text-[#0099A9] focus:outline-none"
							>
								<FaUserCircle size={32} />
							</button>
							{menuOpen && (
								<div className="absolute right-0 mt-2 w-45 bg-white rounded shadow-md z-20">
									<Link
										to="/profile"
										className="block px-4 py-2 text-sm hover:bg-gray-100"
										onClick={() => setMenuOpen(false)}
									>
										Профайл
									</Link>
									<Link
										to="/edit-profile"
										className="block px-4 py-2 text-sm hover:bg-gray-100"
										onClick={() => setMenuOpen(false)}
									>
										Редагувати Профайл
									</Link>
									<button
										onClick={() => {
											logout();
											setMenuOpen(false);
										}}
										className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
									>
										Вихід
									</button>
								</div>
							)}
						</div>
					) : (
						<>
							<Link
								to="/register"
								className="text-sm px-3 py-1 rounded hover:text-[#0099A9]"
							>
								Реєстрація
							</Link>
							<Link
								to="/login"
								className="text-sm px-3 py-1 rounded hover:text-[#0099A9]"
							>
								Логін
							</Link>
							<GoogleLoginButton />
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
