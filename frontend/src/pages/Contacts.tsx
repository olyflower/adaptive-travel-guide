import { useTranslation } from "react-i18next";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import contactImage from "../assets/code.jpg";

const Contacts = () => {
	const { t } = useTranslation();

	const contactLinks = [
		{
			id: "email",
			href: "mailto:example@example.com",
			icon: FaEnvelope,
			label: "example@example.com",
			external: false,
		},
		{
			id: "github",
			href: "https://github.com",
			icon: FaGithub,
			label: "GitHub: Adaptive Travel Guide",
			external: true,
		},
		{
			id: "linkedin",
			href: "https://www.linkedin.com/",
			icon: FaLinkedin,
			label: "LinkedIn",
			external: true,
		},
	];

	return (
		<section
			className="w-full py-12 px-4 max-w-6xl mx-auto text-(--color-text) bg-(--color-background-main) 
		mt-8 md:mt-12 mb-24 md:mb-32"
		>
			<title>{t("meta.contacts_title")}</title>
			<meta name="description" content={t("meta.contacts_description")} />
			<h1 className="text-3xl font-bold text-center mb-8">
				{t("contacts.title")}
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
				<div className="space-y-6 text-lg leading-relaxed">
					<p>{t("contacts.p1")}</p>
					<p>{t("contacts.p2")}</p>

					<div className="space-y-4">
						{contactLinks.map(
							({ id, href, icon: Icon, label, external }) => (
								<div key={id} className="flex items-center">
									<a
										href={href}
										target={external ? "_blank" : undefined}
										rel={
											external
												? "noopener noreferrer"
												: undefined
										}
										className="flex items-center space-x-4 group transition-colors duration-300"
									>
										<Icon
											className="text-(--color-primary) group-hover:text-(--color-primary-hover) transition-colors"
											size={24}
										/>
										<span className="text-(--color-text) group-hover:text-(--color-primary-hover) transition-colors">
											{label}
										</span>
									</a>
								</div>
							),
						)}
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
