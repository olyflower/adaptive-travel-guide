import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Loader from "./components/Loader";
import PrivateRoute from "./components/PrivateRoute";

const About = lazy(() => import("./pages/About"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PasswordResetRequest = lazy(() => import("./pages/PasswordResetRequest"));
const PasswordResetConfirm = lazy(() => import("./pages/PasswordResetConfirm"));
const RecommendationsPage = lazy(
	() => import("./pages/Recommendation/RecommendationsPage"),
);
const Plans = lazy(() => import("./pages/Plans"));
const PlanDetails = lazy(() => import("./pages/PlanDetails"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
	return (
		<AuthProvider>
			<GoogleOAuthProvider clientId={clientId}>
				<Router>
					<Suspense fallback={<Loader />}>
						<Routes>
							<Route path="/" element={<Layout />}>
								<Route index element={<Home />} />

								<Route path="login" element={<Login />} />
								<Route path="register" element={<Register />} />
								<Route
									path="forgot-password"
									element={<PasswordResetRequest />}
								/>
								<Route
									path="password-reset-confirm"
									element={<PasswordResetConfirm />}
								/>

								<Route path="about" element={<About />} />
								<Route path="contacts" element={<Contacts />} />

								<Route
									path="profile"
									element={
										<PrivateRoute>
											<Profile />
										</PrivateRoute>
									}
								/>

								<Route
									path="recommendations"
									element={
										<PrivateRoute>
											<RecommendationsPage />
										</PrivateRoute>
									}
								/>

								<Route
									path="plans"
									element={
										<PrivateRoute>
											<Plans />
										</PrivateRoute>
									}
								/>

								<Route
									path="plans/:id"
									element={
										<PrivateRoute>
											<PlanDetails />
										</PrivateRoute>
									}
								/>

								<Route path="*" element={<PageNotFound />} />
							</Route>
						</Routes>
					</Suspense>
				</Router>
			</GoogleOAuthProvider>
		</AuthProvider>
	);
}

export default App;
