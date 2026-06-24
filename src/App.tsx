import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/Theme/ThemeContext';
import { store } from '@/store';
import { setData } from '@/store/dashboardSlice';
import { getDashboardData } from '@/lib/api';
import AppRoutes from '@/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getDashboardData();
        dispatch(setData(data));
      } catch (e) {
        console.error('Error fetching synchronized state from SQLite API:', e);
      }
    };

    loadData();

    // Poll the backend SQLite database every 10 seconds for real-time synchronization
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return <AppRoutes />;
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AppContent />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
