import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    return async () => {
        const response = await axios.get('/auth/refresh', {
            headers: {
                "authorization": `Bearer ${auth.refreshToken}`
            }
        });
        setAuth(prev => {
            return {...prev, accessToken: response.data.access_token}
        });
        return response.data.access_token;
    };
};

export default useRefreshToken;
