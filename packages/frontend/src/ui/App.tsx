import { store } from '@application/state/store';
import AppRoutes from '@ui/routes';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
