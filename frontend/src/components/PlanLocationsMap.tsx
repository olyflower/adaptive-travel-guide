import { useMemo } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	Polyline,
} from "react-leaflet";
import L from "leaflet";
import {
	TripPlanRecommendation,
	GeneratedRoute,
} from "../services/TripPlanService";
import { useTranslation } from "react-i18next";
import { getTranslatedName } from "../utils/translate";
import "leaflet/dist/leaflet.css";

type PlanLocationsMapProps = {
	recommendations: TripPlanRecommendation[];
	route: GeneratedRoute | null;
};

const markerIcon = new L.Icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

const PlanLocationsMap = ({
	recommendations,
	route,
}: PlanLocationsMapProps) => {
	const { t, i18n } = useTranslation();

	const locationsWithCoords = useMemo(
		() =>
			recommendations
				.map((rec) => rec.location)
				.filter(
					(location) => location.lat != null && location.lon != null,
				),
		[recommendations],
	);

	if (locationsWithCoords.length === 0) {
		return (
			<div className="p-6 rounded-3xl border border-dashed border-(--color-border) text-center">
				<p className="text-(--color-text) opacity-70">
					{t("plans.map_not_available")}
				</p>
			</div>
		);
	}

	const center: [number, number] =
		locationsWithCoords.length === 1
			? [locationsWithCoords[0].lat!, locationsWithCoords[0].lon!]
			: [
					locationsWithCoords.reduce(
						(sum, loc) => sum + (loc.lat ?? 0),
						0,
					) / locationsWithCoords.length,
					locationsWithCoords.reduce(
						(sum, loc) => sum + (loc.lon ?? 0),
						0,
					) / locationsWithCoords.length,
				];

	const routePositions =
		route?.route_geometry.coordinates.map(
			(coord: number[]) => [coord[1], coord[0]] as [number, number],
		) ?? [];

	return (
		<div className="rounded-3xl overflow-hidden border border-(--color-primary)/10 shadow-sm">
			<MapContainer
				center={center}
				zoom={13}
				scrollWheelZoom={true}
				className="h-105 w-full z-0"
			>
				<TileLayer
					attribution="&copy; OpenStreetMap contributors"
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{locationsWithCoords.map((location) => (
					<Marker
						key={location.id}
						position={[location.lat!, location.lon!]}
						icon={markerIcon}
					>
						<Popup>
							<div className="space-y-1">
								<p className="font-semibold">
									{getTranslatedName(location, i18n, "name")}
								</p>
								{location.address && (
									<p className="text-sm opacity-80">
										{location.address}
									</p>
								)}
							</div>
						</Popup>
					</Marker>
				))}
				{routePositions.length > 0 && (
					<Polyline positions={routePositions} />
				)}
			</MapContainer>
		</div>
	);
};

export default PlanLocationsMap;
