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

interface UserProfile {
	nickname?: string;
	preferences_text?: string;
	profile_complete: boolean;
}

interface User {
	id: number;
	email: string;
	username: string;
	profile: UserProfile | null;
}

interface AuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	login: (email: string, password?: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	const checkAuthStatus = async () => {
		try {
			const data = await checkAuthStatusRequest();
			setIsAuthenticated(data.isAuthenticated);
			setUser(data.user);
		} catch {
			setIsAuthenticated(false);
			setUser(null);
		}
	};

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const handleLogin = async (emailOrToken: string, password?: string) => {
		try {
			if (password) {
				await loginRequest(emailOrToken, password);
			} else {
				await googleLoginRequest(emailOrToken);
			}
			await checkAuthStatus();
		} catch (error) {
			throw error;
		}
	};

	const handleLogout = async () => {
		await logoutRequest();
		setIsAuthenticated(false);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				login: handleLogin,
				logout: handleLogout,
				checkAuthStatus,
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
