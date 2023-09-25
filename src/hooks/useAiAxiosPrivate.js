import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import {useEffect} from "react";
import {aiAxiosPrivate} from "../api/axios";

const useAiAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = aiAxiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = aiAxiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && prevRequest?.sent === undefined) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return aiAxiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            aiAxiosPrivate.interceptors.request.eject(requestIntercept);
            aiAxiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return aiAxiosPrivate;
}

export default useAiAxiosPrivate;