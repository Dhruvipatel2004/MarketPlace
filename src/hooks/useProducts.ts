import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/api';

export const useProducts = () => {
    const {
        data: products = [],
        isLoading: loading,
        error,
        refetch: refresh
    } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        products,
        loading,
        error: error ? error.message : null,
        refresh
    };
};
