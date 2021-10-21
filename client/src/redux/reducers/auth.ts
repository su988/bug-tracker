import { UserState } from '../types';

interface InitialAuthState {
  user: UserState | null;
  loading: boolean;
  error: string | null;
}

const initialState: InitialAuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action: any) => {};
