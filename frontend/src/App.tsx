import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import PageNotFound from "./pages/PageNotFound";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
	return (
		<AuthProvider>
			<GoogleOAuthProvider clientId={clientId}>
				<Router>
					<Routes>
						<Route index element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route
							path="/forgot-password"
							element={<PasswordResetRequest />}
						/>
						<Route
							path="/password-reset-confirm"
							element={<PasswordResetConfirm />}
						/>
						<Route path="/register" element={<Register />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/edit-profile" element={<EditProfile />} />
						<Route path="/about" element={<About />} />
						<Route path="/contacts" element={<Contacts />} />
						<Route path="/*" element={<PageNotFound />} />
					</Routes>
				</Router>
			</GoogleOAuthProvider>
		</AuthProvider>
	);
}

export default App;
