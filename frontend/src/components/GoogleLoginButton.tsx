import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const GoogleLoginButton: React.FC = () => {
	const { login } = useAuth();
	const handleSuccess = async (credentialResponse: CredentialResponse) => {
		try {
			const { credential: idToken } = credentialResponse;

			if (!idToken) {
				console.error("Google login failed: No id_token received");
				return;
			}

			await login(idToken);
		} catch (error) {
			console.error("Google login failed", error);
		}
	};

	return (
		<GoogleLogin
			onSuccess={handleSuccess}
			onError={() => console.error("Login Failed")}
		/>
	);
};

export default GoogleLoginButton;
