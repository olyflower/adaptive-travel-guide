import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const GoogleLoginButton = () => {
	const { t, i18n } = useTranslation();
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

	return (
		<div className="flex flex-col items-center w-full">
			<div className="min-h-10 w-full flex justify-center">
				<GoogleLogin
					onSuccess={handleSuccess}
					onError={() =>
						setErrorMessage("errors.google_error_general")
					}
					locale={i18n.language}
					theme="outline"
					size="large"
					shape="pill"
					width="222"
				/>
			</div>

			{errorMessage && (
				<p className="text-(--color-red) text-xs mt-2 text-center animate-pulse">
					{t(errorMessage)}
				</p>
			)}
		</div>
	);
};

export default GoogleLoginButton;
