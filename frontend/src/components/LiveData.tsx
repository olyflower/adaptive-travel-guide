import { useEffect, useState } from "react";
import {
	loadWeatherData,
	WeatherData,
	getCurrencyByCountry,
	loadExchangeRate,
} from "../services/LiveDataService";
import { useTranslation } from "react-i18next";
import { FaCloudSun, FaEuroSign } from "react-icons/fa";
import BgImage from "../assets/livedata.jpg";

const iconBaseUrl = import.meta.env.VITE_OPENWEATHER_ICON_URL;

const LiveData = () => {
	const { t } = useTranslation();

	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [currency, setCurrency] = useState<string | null>(null);
	const [exchangeRate, setExchangeRate] = useState<number | null>(null);

	useEffect(() => {
		const fetchWeatherAndFact = async () => {
			const weatherData = await loadWeatherData();
			if (weatherData) {
				setWeather(weatherData);
				setCurrency(getCurrencyByCountry(weatherData.country));
			}
		};
		fetchWeatherAndFact();
	}, []);

	useEffect(() => {
		if (!currency) return;

		const fetchRate = async () => {
			const targetFrom = currency === "UAH" ? "EUR" : currency;
			const rate = await loadExchangeRate(targetFrom, "UAH");

			if (rate !== null) {
				setExchangeRate(rate);
				if (targetFrom !== currency) {
					setCurrency(targetFrom);
				}
			}
		};
		fetchRate();
	}, [currency]);

	return (
		<section className="w-full text-(--color-text)">
			<div className="text-center py-10 px-4">
				<h2 className="text-lg md:text-3xl font-bold mb-2">
					{t("live_data.title")}
				</h2>
			</div>

			<div className="max-w-6xl mx-auto px-4">
				<div className="relative w-full h-[calc(40vh-3rem)] overflow-hidden rounded-lg">
					<img
						src={BgImage}
						alt={t("live_data.alt_img")}
						className="w-full h-full object-cover"
					/>
				</div>
			</div>

			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 py-10 px-4">
				<div className="p-6 text-center">
					<div className="flex justify-center mb-3">
						<FaCloudSun
							size={28}
							className="text-(--color-primary) hover:text-(--color-primary-hover)"
						/>
					</div>
					<h3 className="text-lg font-semibold mb-2">
						{t("live_data.weather")}
					</h3>
					{weather ? (
						<>
							<p className="text-2xl font-bold pb-2">
								<img
									src={`${iconBaseUrl}/${weather.icon}@2x.png`}
									alt="Weather Icon"
									className="inline w-8 h-8 mr-2 align-middle"
								/>
								{weather.temperature}°C
							</p>
							<p className="text-sm">{weather.city}</p>
						</>
					) : (
						<div className="flex flex-col items-center gap-2 animate-pulse">
							<div className="h-8 w-24 bg-(--color-bg-nav-footer) rounded"></div>
							<div className="h-4 w-16 bg-(--color-bg-nav-footer) rounded"></div>
						</div>
					)}
				</div>

				<div className="p-6 text-center">
					<div className="flex justify-center mb-3">
						<FaEuroSign
							size={28}
							className="text-(--color-primary) hover:text-(--color-primary-hover)"
						/>
					</div>
					<h3 className="text-lg font-semibold mb-2">
						{t("live_data.currency")}
					</h3>
					{exchangeRate !== null && currency ? (
						<>
							<p className="text-2xl font-bold pb-2">
								{currency} {exchangeRate.toFixed(2)}
							</p>
							<p className="text-sm">{currency} → UAH</p>
						</>
					) : (
						<div className="flex flex-col items-center gap-2 animate-pulse">
							<div className="h-8 w-32 bg-(--color-bg-nav-footer) rounded"></div>
							<div className="h-4 w-20 bg-(--color-bg-nav-footer) rounded"></div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default LiveData;
