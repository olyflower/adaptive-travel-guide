import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
	const [isDark, setIsDark] = useState<boolean>(() => {
		if (typeof window !== "undefined") {
			const savedTheme = localStorage.getItem("theme");
			if (savedTheme) {
				return savedTheme === "dark";
			}
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return false;
	});

	useEffect(() => {
		const root = document.documentElement;
		if (isDark) {
			root.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			root.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [isDark]);

	return (
		<button
			onClick={() => setIsDark((prev) => !prev)}
			className="p-2 rounded-full bg-surface text-(--color-primary) hover:bg-(--color-primary-hover) 
			hover:text-(--color-content) transition-all shadow-sm cursor-pointer flex items-center justify-center"
			aria-label="Toggle theme"
			title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
		>
			{isDark ? <FaSun size={24} /> : <FaMoon size={24} />}
		</button>
	);
};

export default ThemeToggle;
