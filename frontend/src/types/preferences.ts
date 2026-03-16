/**
 * Preference option within a category
 */
export interface Option {
	id: number;
	name: string;
}

/**
 * Preference category containing multiple options
 */
export interface Category {
	id: number;
	name: string;
	options: Option[];
}
