import Hero from "../components/Hero";
import TravelStylePicker from "../components/TravelPicker";
import Features from "../components/Features";
import LiveData from "../components/LiveData";
import StartTravelAction from "../components/StartTravelAction";

const Home = () => {
	return (
		<div>
			<Hero />
			<TravelStylePicker />
			<LiveData />
			<Features />
			<StartTravelAction />
		</div>
	);
};

export default Home;
