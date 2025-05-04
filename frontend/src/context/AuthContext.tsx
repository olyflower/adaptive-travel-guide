import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import {
	loginRequest,
	logoutRequest,
	checkAuthStatusRequest,
	googleLoginRequest,
} from "../services/AuthService";

interface AuthContextType {
	isAuthenticated: boolean;
	login: (email: string, password?: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkStatus = async () => {
			const isAuth = await checkAuthStatusRequest();
			setIsAuthenticated(isAuth);
		};

		checkStatus();
	}, []);

	const handleLogin = async (emailOrToken: string, password?: string) => {
		try {
			if (password) {
				await loginRequest(emailOrToken, password);
			} else {
				await googleLoginRequest(emailOrToken);
			}
			const status = await checkAuthStatusRequest();
			setIsAuthenticated(status);
		} catch (error) {
			console.error(error);
		}
	};

	const handleLogout = async () => {
		await logoutRequest();
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				login: handleLogin,
				logout: handleLogout,
				checkAuthStatus: checkAuthStatusRequest,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error();
	}
	return context;
};
