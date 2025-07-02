import React from "react";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import contactImage from "../assets/code.jpg";

const Contacts: React.FC = () => {
	const { t } = useTranslation();

	return (
		<section className="w-full py-12 px-4 max-w-6xl mx-auto">
			<h2 className="text-3xl font-bold text-center mb-8">
				{t("contacts.title")}
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
				<div className="space-y-6 text-lg leading-relaxed">
					<p>{t("contacts.p1")}</p>

					<p>{t("contacts.p2")}</p>

					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<FaEnvelope
								className="text-[var(--color-purple)]"
								size={24}
							/>
							<a
								href="mailto:example@example.com"
								className="hover:text-[var(--color-purple-hover)]"
							>
								example@example.com
							</a>
						</div>

						<div className="flex items-center space-x-4">
							<FaGithub
								className="text-[var(--color-purple)]"
								size={24}
							/>
							<a
								href="https://github.com/yourusername/project-repo"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub: Adaptive Travel Guide
							</a>
						</div>

						<div className="flex items-center space-x-4">
							<FaLinkedin
								className="text-[var(--color-purple)]"
								size={24}
							/>
							<a
								href="https://www.linkedin.com/in/yourlinkedin/"
								target="_blank"
								rel="noopener noreferrer"
							>
								LinkedIn
							</a>
						</div>
					</div>
				</div>

				<div className="hidden md:block">
					<img
						src={contactImage}
						alt="Contact illustration"
						className="w-full h-auto rounded-xl shadow-lg object-cover"
					/>
				</div>
			</div>
		</section>
	);
};

export default Contacts;
