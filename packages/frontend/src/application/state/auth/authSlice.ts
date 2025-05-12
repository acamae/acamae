import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '@application/use-cases/auth/LogoutUseCase';
import { RegisterUseCase } from '@application/use-cases/auth/RegisterUseCase';
import { AuthState } from '@domain/types/auth';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Async thunks using use cases
export const loginAction = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { extra }) => {
    const { loginUseCase } = extra as { loginUseCase: LoginUseCase };
    return await loginUseCase.execute(credentials);
  }
);

export const registerAction = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; username: string }, { extra }) => {
    const { registerUseCase } = extra as { registerUseCase: RegisterUseCase };
    return await registerUseCase.execute(userData);
  }
);

export const logoutAction = createAsyncThunk(
  'auth/logout',
  async (_, { extra }) => {
    const { logoutUseCase } = extra as { logoutUseCase: LogoutUseCase };
    return await logoutUseCase.execute();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Logout
      .addCase(logoutAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Logout failed';
      })
      // Register
      .addCase(registerAction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAction.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export default authSlice.reducer;
