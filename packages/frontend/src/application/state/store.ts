
import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '@application/use-cases/auth/RegisterUseCase';
import { AuthApiRepository } from '@infrastructure/api/AuthApiRepository';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/authSlice';

// Create repositories
const authRepository = new AuthApiRepository();

// Create use cases
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          loginUseCase,
          registerUseCase,
          // Add other use cases here
        },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
