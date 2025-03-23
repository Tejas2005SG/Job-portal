import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchAllJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get`,
                    {
                        params: { keyword: searchedQuery },
                        withCredentials: true,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                if (mounted && res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                const errorMsg = error.response?.data?.message || 'Failed to fetch jobs';
                setError(errorMsg);
                console.error('Fetch jobs error:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchAllJobs();

        return () => {
            mounted = false;
        };
    }, [searchedQuery, dispatch]);

    return { loading, error };
};

export default useGetAllJobs;