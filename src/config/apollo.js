import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from '../utils/auth';

// HTTP connection to the API
const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://backend-eduhive-1.onrender.com/graphql',
});

// Middleware to add authentication token to headers
const authLink = setContext((_, { headers }) => {
    const token = getToken();
    console.log("🔑 Token envoyé:", token ? `Bearer ${token.substring(0, 20)}...` : "❌ PAS DE TOKEN");
    return {
        headers: {
            ...headers,
            ...(token ? { authorization: `Bearer ${token}` } : {})
        },
    };
});

// Create Apollo Client
const client = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});

export default client;
