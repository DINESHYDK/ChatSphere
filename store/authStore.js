import { create } from "zustand";

const authStore = create((set) => ({
  authUser: null,
  setAuthUser: (userData) => {
    set({ authUser: user });
  },
  SignUp: async (userData) => {
    try { 
        let res = await fetch('/api/auth/signUp',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userData }),
        })
        if (!res.ok){
            return;
        }
        const data = await response.json();
        // set ({ authUser: });
    } catch (error) {
        console.error(error);
    }
  },
  SignIn: async (userData) => {
    try { 
        let res = await fetch('/api/auth/signIn',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userData }),
        })
        if (!res.ok){
            return;
        }
        const data = await response.json();
        // set({ authUser:  })
    } catch (error) {
        console.error(error);
    }
  },
  Logout: async () => {
    await fetch("/api/User/logoutUser");
  },
  updateUser: async (userData) => {
    try { 
        let res = await fetch('/api/auth/update',  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userData }),
        })
        if (!res.ok){
            return;
        }
        const data = await response.json();
        // set({ authUser:  })
    } catch (error) {
        console.error(error);
    }
  },
}));
export default authStore;
