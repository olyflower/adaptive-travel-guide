import React from "react";

const LanguageSwitcher: React.FC = () => {
	return (
		<div className="mt-4 text-center">
			<button className="text-sm mx-2 hover:text-[#4A1158]">Укр</button>
			<span className="text-sm">|</span>
			<button className="text-sm mx-2 hover:text-[#4A1158]">Eng</button>
		</div>
	);
};

export default LanguageSwitcher;
