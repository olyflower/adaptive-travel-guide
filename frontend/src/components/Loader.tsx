const Loader = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-(--color-bg-main) z-50">
			<div className="relative">
				<div className="h-24 w-24 rounded-full border-8 border-(--color-bg-nav-footer) opacity-40"></div>

				<div
					style={{ borderTopColor: "var(--color-primary)" }}
					className="absolute top-0 left-0 h-24 w-24 rounded-full border-8 border-transparent animate-spin"
				></div>

				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full animate-pulse bg-(--color-primary)"></div>
			</div>
		</div>
	);
};

export default Loader;
