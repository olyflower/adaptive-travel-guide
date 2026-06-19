type TechnologyCardProps = {
	icon: React.ElementType;
	name: string;
};

const TechnologyCard = ({ icon: Icon, name }: TechnologyCardProps) => {
	return (
		<div
			className="
				flex flex-col items-center justify-center
				text-center
				rounded-2xl
				bg-(--color-bg-nav-footer)
				px-4 py-6
				shadow-sm
				border border-(--color-primary)/5
				hover:shadow-md
				hover:-translate-y-1
				transition-all duration-300
				group
				min-h-35
			"
		>
			<Icon
				size={32}
				className="
					text-(--color-primary)
					group-hover:text-(--color-primary-hover)
					transition-colors
				"
			/>

			<p
				className="mt-4 text-xs sm:text-sm md:text-base font-medium text-(--color-text) 
						group-hover:text-(--color-primary-hover) transition-colors duration-300"
			>
				{name}
			</p>
		</div>
	);
};

export default TechnologyCard;
