import gourmetImg from "../assets/gourmet.webp";
import urbanistImg from "../assets/urban.webp";
import natureImg from "../assets/nature.webp";
import artistImg from "../assets/artist.webp";
import styleImg from "../assets/style.webp";

export interface PreviewLocation {
	nameKey: string;
	type: string;
}

export interface StylePreview {
	id: string;
	titleKey: string;
	image: string;
	locations: PreviewLocation[];
}

export const travelStylesPreview: StylePreview[] = [
	{
		id: "gourmet",
		titleKey: "travel_picker.gourmet",
		image: gourmetImg,
		locations: [
			{
				nameKey: "previews.gourmet.loc1",
				type: "Restaurant",
			},
			{ nameKey: "previews.gourmet.loc2", type: "Cafe" },
			{ nameKey: "previews.gourmet.loc3", type: "Market" },
		],
	},
	{
		id: "urban",
		titleKey: "travel_picker.urban",
		image: urbanistImg,
		locations: [
			{ nameKey: "previews.urban.loc1", type: "Museum" },
			{ nameKey: "previews.urban.loc2", type: "Square" },
			{ nameKey: "previews.urban.loc3", type: "Skyscraper" },
		],
	},
	{
		id: "nature",
		titleKey: "travel_picker.nature",
		image: natureImg,
		locations: [
			{ nameKey: "previews.nature.loc1", type: "Park" },
			{ nameKey: "previews.nature.loc2", type: "Lake" },
			{ nameKey: "previews.nature.loc3", type: "Mountain" },
		],
	},
	{
		id: "artist",
		titleKey: "travel_picker.artist",
		image: artistImg,
		locations: [
			{ nameKey: "previews.artist.loc1", type: "Gallery" },
			{ nameKey: "previews.artist.loc2", type: "Workshop" },
			{
				nameKey: "previews.artist.loc3",
				type: "Street Art",
			},
		],
	},
	{
		id: "style",
		titleKey: "travel_picker.style",
		image: styleImg,
		locations: [
			{ nameKey: "previews.style.loc1", type: "Boutique" },
			{ nameKey: "previews.style.loc2", type: "Design Hub" },
			{ nameKey: "previews.style.loc3", type: "Exhibition" },
		],
	},
];
