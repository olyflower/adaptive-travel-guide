import axios from "axios";

// weather

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

const CACHE_KEY = "weatherData";
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const DEFAULT_CITY = "Paris";


/**
 * Fetch weather data from the API and store it in localStorage cache
 */
const fetchAndCacheWeather = async (
	cityOrCoords: CityOrCoords,
): Promise<WeatherData | null> => {
	try {
		let url = `${import.meta.env.VITE_API_URL}/api/live/weather/`;

		if (typeof cityOrCoords === "string") {
			url += `?city=${encodeURIComponent(cityOrCoords)}`;
		} else {
			url += `?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}`;
		}

		const response = await axios.get(url);
		const data = { ...response.data, timestamp: Date.now() };
		localStorage.setItem(CACHE_KEY, JSON.stringify(data));
		return data;
	} catch (error) {
		console.error("Error fetching weather data:", error);
		return null;
	}
};

/**
 * Retrieve cached weather data if it is still valid
 */
const getCachedWeather = (): WeatherData | null => {
	const cached = localStorage.getItem(CACHE_KEY);
	if (cached) {
		const parsed: WeatherData = JSON.parse(cached);
		if (Date.now() - parsed.timestamp < CACHE_DURATION) {
			return parsed;
		}
	}
	return null;
};

/**
 * Load weather data using cache when possible
 * Attempts to use user geolocation, falling back to a default city
 */
export const loadWeatherData = async (): Promise<WeatherData | null> => {
	const cached = getCachedWeather();
	if (cached) return cached;

	if ("geolocation" in navigator) {
		try {
			const pos = await new Promise<GeolocationPosition>(
				(resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject, {
						timeout: 5000,
					});
				},
			);

			const { latitude: lat, longitude: lon } = pos.coords;
			return await fetchAndCacheWeather({ lat, lon });
		} catch (error) {
			return await fetchAndCacheWeather(DEFAULT_CITY);
		}
	} else {
		return await fetchAndCacheWeather(DEFAULT_CITY);
	}
};

//currency
const CURRENCY_CACHE_KEY = "currencyData";
const CURRENCY_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 часов

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
		const url = `${
			import.meta.env.VITE_API_URL
		}/api/live/currency?from=${from}&to=${to}`;
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
	const cached = getCachedCurrencyRate(from, to);
	if (cached) return cached.rate;

	const fetched = await fetchAndCacheCurrencyRate(from, to);
	return fetched ? fetched.rate : null;
};
