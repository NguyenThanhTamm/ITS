import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/types';
import { loadMockState, saveMockState } from '@/data/mock';

const savedState = loadMockState();

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auto restore session if token exists
const sessionToken = localStorage.getItem('tam_its_session_token');
if (sessionToken && savedState.user) {
  initialState.user = savedState.user;
  initialState.token = sessionToken;
  initialState.refreshToken = 'mock-refresh-token-xyz';
  initialState.isAuthenticated = true;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = 'mock-refresh-token-xyz';
      localStorage.setItem('tam_its_session_token', action.payload.token);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('tam_its_session_token');
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload } as User;
        const currentMock = loadMockState();
        currentMock.user = state.user;
        // Sync inside users list too
        const userInList = currentMock.users.find(u => u.id === state.user!.id);
        if (userInList) {
          Object.assign(userInList, action.payload);
        }
        saveMockState(currentMock);
      }
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
