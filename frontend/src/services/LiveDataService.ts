import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * City name or geographic coordinates used to request weather data
 */
type CityOrCoords = string | { lat: number; lon: number };

/**
 * Weather data returned from the backend API
 */
export type WeatherData = {
	city: string;
	country: string;
	temperature: number;
	icon: string;
	timestamp: number;
};

const WEATHER_CACHE_DURATION = 30 * 60 * 1000;
const DEFAULT_CITY = "Paris";

const getWeatherCacheKey = (cityOrCoords: CityOrCoords) =>
	typeof cityOrCoords === "string"
		? `weather_city_${cityOrCoords.toLowerCase()}`
		: `weather_coords_${cityOrCoords.lat}_${cityOrCoords.lon}`;

/**
 * Fetch weather data from the API and store it in localStorage cache
 */
const fetchAndCacheWeather = async (
	cityOrCoords: CityOrCoords,
): Promise<WeatherData | null> => {
	try {
		let url = `${API_URL}/api/live/weather/`;

		if (typeof cityOrCoords === "string") {
			url += `?city=${encodeURIComponent(cityOrCoords)}`;
		} else {
			url += `?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}`;
		}

		const response = await axios.get(url);
		const data: WeatherData = { ...response.data, timestamp: Date.now() };

		localStorage.setItem(
			getWeatherCacheKey(cityOrCoords),
			JSON.stringify(data),
		);
		return data;
	} catch (error) {
		console.error("Error fetching weather data:", error);
		return null;
	}
};

/**
 * Retrieve cached weather data if it is still valid
 */
const getCachedWeather = (cityOrCoords: CityOrCoords): WeatherData | null => {
	const cached = localStorage.getItem(getWeatherCacheKey(cityOrCoords));
	if (!cached) return null;

	try {
		const parsed: WeatherData = JSON.parse(cached);
		if (Date.now() - parsed.timestamp < WEATHER_CACHE_DURATION) {
			return parsed;
		}
	} catch {
		return null;
	}

	return null;
};

/**
 * Load weather data using cache when possible
 * Attempts to use user geolocation, falling back to a default city
 */
export const loadWeatherData = async (): Promise<WeatherData | null> => {
	if ("geolocation" in navigator) {
		try {
			const pos = await new Promise<GeolocationPosition>(
				(resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject, {
						timeout: 5000,
					});
				},
			);

			const cityOrCoords = {
				lat: pos.coords.latitude,
				lon: pos.coords.longitude,
			};

			const cached = getCachedWeather(cityOrCoords);
			if (cached) return cached;

			return fetchAndCacheWeather(cityOrCoords);
		} catch {
			const cached = getCachedWeather(DEFAULT_CITY);
			if (cached) return cached;

			return fetchAndCacheWeather(DEFAULT_CITY);
		}
	}

	const cached = getCachedWeather(DEFAULT_CITY);
	if (cached) return cached;

	return fetchAndCacheWeather(DEFAULT_CITY);
};

const CURRENCY_CACHE_KEY = "currencyData";
const CURRENCY_CACHE_DURATION = 12 * 60 * 60 * 1000;

/**
 * Cached exchange rate structure stored in localStorage
 */
type CachedRate = {
	from: string;
	to: string;
	rate: number;
	timestamp: number;
};

/**
 * Mapping of country codes to their main currencies
 */
export const countryToCurrency: Record<string, string> = {
	FR: "EUR",
	US: "USD",
	GB: "GBP",
	PL: "PLN",
	DE: "EUR",
	CZ: "CZK",
	UA: "UAH",
	BG: "BGN",
};

/**
 * Return the currency code for a given country code
 */
export const getCurrencyByCountry = (countryCode: string): string => {
	return countryToCurrency[countryCode] || "USD";
};

/**
 * Retrieve cached exchange rate if it is still valid
 */
const getCachedCurrencyRate = (from: string, to: string): CachedRate | null => {
	const cached = localStorage.getItem(CURRENCY_CACHE_KEY);
	if (!cached) return null;

	try {
		const parsed: CachedRate = JSON.parse(cached);
		if (
			parsed.from === from &&
			parsed.to === to &&
			Date.now() - parsed.timestamp < CURRENCY_CACHE_DURATION
		) {
			return parsed;
		}
	} catch {
		return null;
	}

	return null;
};

/**
 * Fetch exchange rate from the API and store it in cache
 */
const fetchAndCacheCurrencyRate = async (
	from: string,
	to: string,
): Promise<CachedRate | null> => {
	try {
		const url = `${API_URL}/api/live/currency?from=${from}&to=${to}`;
		const response = await axios.get(url);
		const rate = response.data.rate;

		const cacheItem: CachedRate = {
			from,
			to,
			rate,
			timestamp: Date.now(),
		};
		localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify(cacheItem));

		return cacheItem;
	} catch (error) {
		console.error("Error fetching exchange rate:", error);
		return null;
	}
};

/**
 * Load exchange rate using cached data when available
 */
export const loadExchangeRate = async (
	from: string,
	to: string,
): Promise<number | null> => {
	if (from === to) return 1;

	const cached = getCachedCurrencyRate(from, to);
	if (cached) return cached.rate;

	const fetched = await fetchAndCacheCurrencyRate(from, to);
	return fetched ? fetched.rate : null;
};
