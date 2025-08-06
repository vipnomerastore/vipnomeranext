import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

import { SERVER_URL } from "@/shared/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: { id: number; name: string };
}

interface AuthState {
  jwt: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

// Хранилище для Авторизации
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwt: null,
      user: null,
      isAuthenticated: false,

      // Авторизация
      login: async (email: string, password: string) => {
        try {
          const response = await axios.post(`${SERVER_URL}/auth/local`, {
            identifier: email,
            // email,
            password,
          });

          const jwt = response.data.jwt;
          let user = response.data.user;

          // Запрашиваем роль отдельно
          const userResponse = await axios.get(
            `${SERVER_URL}/users/me?populate=*`,
            {
              headers: { Authorization: `Bearer ${jwt}` },
            }
          );

          user = { ...user, role: userResponse.data.role };

          set({
            jwt,
            user,
            isAuthenticated: true,
          });
        } catch (err: any) {
          throw new Error(err.response?.data?.error?.message || "Ошибка входа");
        }
      },

      // Регистрация
      register: async (username: string, email: string, password: string) => {
        try {
          const response = await axios.post(
            `${SERVER_URL}/auth/local/register`,
            {
              username,
              email,
              password,
            }
          );

          set({
            jwt: response.data.jwt,
            user: response.data.user,
            isAuthenticated: true,
          });
        } catch (err: any) {
          throw new Error(
            err.response?.data?.error?.message || "Ошибка регистрации"
          );
        }
      },

      // Выход из аккаунта
      logout: () => {
        set({ jwt: null, user: null, isAuthenticated: false });
      },
    }),
    // Сохраняем данные в LocalStorage
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
