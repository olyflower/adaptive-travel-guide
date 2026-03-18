export interface LocationCity {
	id: number;
	name_uk: string;
	name_en: string;
}

export interface LocationCategory {
	id: number;
	name_uk: string;
	name_en: string;
}

export interface LocationData {
	id: number;
	name_uk: string;
	name_en: string;
	description_uk?: string;
	description_en?: string;
	city: LocationCity;
	category?: LocationCategory | null;
	distance?: number;
	is_in_trip: boolean;
}
