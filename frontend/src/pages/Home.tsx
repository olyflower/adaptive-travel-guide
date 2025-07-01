import React from "react";
import Hero from "../components/Hero";
import TravelStylePicker from "../components/TravelPicker";
import Features from "../components/Features";
import LiveData from "../components/LiveData";
import StartTravelAction from "../components/StartTravelAction";

const Home: React.FC = () => {
	return (
		<div className="min-h-screen bg-[var(--color-bg-main)]">
			<Hero />
			<TravelStylePicker />
			<LiveData />
			<Features />
			<StartTravelAction />
		</div>
	);
};

export default Home;
