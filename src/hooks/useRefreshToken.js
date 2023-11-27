import axios from '../api/axios';
import useAuth from './useAuth';
import {useNavigate} from "react-router-dom";

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    return async () => {
        try {
            const response = await axios.get('/auth/refresh', {
                headers: {
                    "authorization": `Bearer ${auth.refreshToken}`
                }
            });
            setAuth(prev => {
                return {...prev, accessToken: response.data.access_token}
            });
            return response.data.access_token;
        } catch (error) {
            setAuth({});
            navigate('/login');
        }
    };
};

export default useRefreshToken;
