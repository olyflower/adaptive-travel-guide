import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const GoogleLoginButton: React.FC = () => {
	const { t } = useTranslation();
	const { login } = useAuth();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSuccess = async (credentialResponse: CredentialResponse) => {
		try {
			const { credential: idToken } = credentialResponse;

			if (!idToken) {
				setErrorMessage("errors.google_error");
				return;
			}

			await login(idToken);
			setErrorMessage(null);
		} catch (error) {
			setErrorMessage("errors.google_error_general");
		}
	};

	const handleError = () => {
		setErrorMessage("errors.google_error_general");
	};

	return (
		<div>
			<GoogleLogin onSuccess={handleSuccess} onError={handleError} />
			{errorMessage && (
				<p className="text-red-500 text-[12px] mt-2 text-center">
					{t(errorMessage)}
				</p>
			)}
		</div>
	);
};

export default GoogleLoginButton;
