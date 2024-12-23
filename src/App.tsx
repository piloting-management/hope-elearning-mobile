import { addEventListener } from '@react-native-community/netinfo';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import MainNavigation from './MainNavigation';
import { ApiError } from './lib/errors';
import { store } from './lib/store';
import { TOLGEE_API_URL, TOLGEE_API_KEY } from '@env';
import { Tolgee, DevTools, TolgeeProvider, FormatSimple } from '@tolgee/react';
import en from './i18n/en.json';
import tr from './i18n/tr.json';
import { FormatIcu } from '@tolgee/format-icu';
import '@formatjs/intl-locale/polyfill';

const tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({
  language: 'en',
  // for development
  // apiUrl: TOLGEE_API_URL,
  // apiKey: TOLGEE_API_KEY,
  staticData: { en, tr },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          return false;
        }

        if (failureCount >= 1) {
          return false;
        }

        return true;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    },
  }),
});

const App = () => {
  useEffect(() => {
    let appState = AppState.currentState;

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          focusManager.setFocused(true);
        } else {
          focusManager.setFocused(false);
        }
        appState = nextAppState;
      }
    );

    onlineManager.setEventListener((setOnline) => {
      return addEventListener((nextState) => {
        setOnline(!!nextState.isConnected);
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <TolgeeProvider tolgee={tolgee}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <QueryClientProvider client={queryClient}>
            <MainNavigation />
          </QueryClientProvider>
        </SafeAreaProvider>
      </TolgeeProvider>
    </Provider>
  );
};

export default App;
