import React from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import TravelStylePicker from "../components/TravelPicker";
import Features from "../components/Features";
import LiveData from "../components/LiveData";
import StartTravelAction from "../components/StartTravelAction";
import Footer from "../components/Footer";

const Home: React.FC = () => {
	return (
		<div className="min-h-screen bg-[#F6F0FA]">
			<NavBar />
			<Hero />
			<TravelStylePicker />
			<LiveData />
			<Features />
			<StartTravelAction />
			<Footer />
		</div>
	);
};

export default Home;
