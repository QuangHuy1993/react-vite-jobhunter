import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  user: {
    id: number;
    email: string;
    name: string;
  };
 
}

export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.user.id;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};