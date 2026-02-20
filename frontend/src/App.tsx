import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Loader from "./components/Loader";

const About = lazy(() => import("./pages/About"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PasswordResetRequest = lazy(() => import("./pages/PasswordResetRequest"));
const PasswordResetConfirm = lazy(() => import("./pages/PasswordResetConfirm"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
	return (
		<AuthProvider>
			<GoogleOAuthProvider clientId={clientId}>
				<Router>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route index element={<Home />} />

							<Route
								path="*"
								element={
									<Suspense fallback={<Loader />}>
										<Routes>
											<Route
												path="login"
												element={<Login />}
											/>
											<Route
												path="forgot-password"
												element={
													<PasswordResetRequest />
												}
											/>
											<Route
												path="password-reset-confirm"
												element={
													<PasswordResetConfirm />
												}
											/>
											<Route
												path="register"
												element={<Register />}
											/>
											<Route
												path="profile"
												element={<Profile />}
											/>
											<Route
												path="about"
												element={<About />}
											/>
											<Route
												path="contacts"
												element={<Contacts />}
											/>
											<Route
												path="*"
												element={<PageNotFound />}
											/>
										</Routes>
									</Suspense>
								}
							/>
						</Route>
					</Routes>
				</Router>
			</GoogleOAuthProvider>
		</AuthProvider>
	);
}

export default App;
