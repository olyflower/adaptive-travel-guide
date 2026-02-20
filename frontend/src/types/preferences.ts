export interface Option {
	id: number;
	name: string;
}

export interface Category {
	id: number;
	name: string;
	options: Option[];
}
