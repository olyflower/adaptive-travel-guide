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


/**
 * User profile data returned from backend
 */
interface UserProfile {
	nickname?: string;
	preferences_text?: string;
	profile_complete: boolean;
}

/**
 * User profile data returned from backend
 */
interface User {
	id: number;
	email: string;
	username: string;
	profile: UserProfile | null;
}

/**
 * Authentication context type containing state and actions
 */
interface AuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	login: (email: string, password?: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuthStatus: () => Promise<void>;
}

/**
 * React context for authentication state
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication state and actions to children components
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	/**
	 * Checks current user authentication status from backend
	 */
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

	/**
	 * Logs in user either via email/password or Google OAuth
	 */
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

	/**
	 * Logs out current user and resets state
	 */
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

/**
 * Hook to access authentication context
 */
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error();
	}
	return context;
};
