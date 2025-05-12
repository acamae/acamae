import { loginAction, logoutAction, registerAction } from '@application/state/auth/authSlice';
import { RootState, AppDispatch } from '@application/state/store';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';


export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await dispatch(loginAction({ email, password })).unwrap();
        return true;
      } catch (err) {
        return false;
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        await dispatch(registerAction({ email, password, username })).unwrap();
        return true;
      } catch (err) {
        return false;
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};
