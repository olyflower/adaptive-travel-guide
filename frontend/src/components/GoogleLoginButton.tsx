import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const GoogleLoginButton: React.FC = () => {
	const { login } = useAuth();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSuccess = async (credentialResponse: CredentialResponse) => {
		try {
			const { credential: idToken } = credentialResponse;

			if (!idToken) {
				setErrorMessage(
					"Не вдалося увійти через Google. Спробуйте ще раз."
				);
				return;
			}

			await login(idToken);
			setErrorMessage(null);
		} catch (error) {
			setErrorMessage(
				"Не вдалося увійти через Google."
			);
		}
	};

	const handleError = () => {
		setErrorMessage("Не вдалося увійти через Google.");
	};

	return (
		<div>
			<GoogleLogin onSuccess={handleSuccess} onError={handleError} />
			{errorMessage && (
				<p className="text-red-500 text-[12px] mt-2 text-center">
					{errorMessage}
				</p>
			)}
		</div>
	);
};

export default GoogleLoginButton;
