import gourmetImg from "../assets/gourmet.webp";
import urbanistImg from "../assets/urban.webp";
import natureImg from "../assets/nature.webp";
import artistImg from "../assets/artist.webp";
import styleImg from "../assets/style.webp";

export interface PreviewLocation {
	nameKey: string;
	type: string;
	rating: number;
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
				rating: 4.9,
			},
			{ nameKey: "previews.gourmet.loc2", type: "Cafe", rating: 4.7 },
			{ nameKey: "previews.gourmet.loc3", type: "Market", rating: 4.8 },
		],
	},
	{
		id: "urban",
		titleKey: "travel_picker.urban",
		image: urbanistImg,
		locations: [
			{ nameKey: "previews.urban.loc1", type: "Museum", rating: 4.6 },
			{ nameKey: "previews.urban.loc2", type: "Square", rating: 4.9 },
			{ nameKey: "previews.urban.loc3", type: "Skyscraper", rating: 4.5 },
		],
	},
	{
		id: "nature",
		titleKey: "travel_picker.nature",
		image: natureImg,
		locations: [
			{ nameKey: "previews.nature.loc1", type: "Park", rating: 5.0 },
			{ nameKey: "previews.nature.loc2", type: "Lake", rating: 4.9 },
			{ nameKey: "previews.nature.loc3", type: "Mountain", rating: 4.8 },
		],
	},
	{
		id: "artist",
		titleKey: "travel_picker.artist",
		image: artistImg,
		locations: [
			{ nameKey: "previews.artist.loc1", type: "Gallery", rating: 4.8 },
			{ nameKey: "previews.artist.loc2", type: "Workshop", rating: 4.7 },
			{
				nameKey: "previews.artist.loc3",
				type: "Street Art",
				rating: 4.9,
			},
		],
	},
	{
		id: "style",
		titleKey: "travel_picker.style",
		image: styleImg,
		locations: [
			{ nameKey: "previews.style.loc1", type: "Boutique", rating: 4.7 },
			{ nameKey: "previews.style.loc2", type: "Design Hub", rating: 4.6 },
			{ nameKey: "previews.style.loc3", type: "Exhibition", rating: 4.8 },
		],
	},
];
