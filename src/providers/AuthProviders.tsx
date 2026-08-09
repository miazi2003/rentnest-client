"use client";

import { AuthContextType, IUser } from "@/app/features/auth/types";
import { getCurrentUserAction } from "@/app/features/auth/actions/getCurrentUserAction";
import { createContext, ReactNode, useEffect, useState } from "react";


export const AuthContext = createContext<AuthContextType | null>(null);



const AuthProvider = ({
    children
}: {
    children: ReactNode
}) => {

    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    const getUser = async(): Promise<IUser | null> =>{
      try{
          const res = await getCurrentUserAction()
        if(!res || !res.ok || !res.data?.data){
            setUser(null)
            return null
        } else {
            setUser(res.data.data)
            return res.data.data
        }
      }catch{
        setUser(null)
        return null
      }finally {
    setLoading(false);
  }

    }



useEffect(() => {
  const timer = window.setTimeout(() => void getUser(), 0);
  return () => window.clearTimeout(timer);
}, []);
    return <AuthContext.Provider  value={{
    user,
    loading,
    setUser,
    getUser,
    
  }}>
        {children}
    </AuthContext.Provider>
}


export default AuthProvider;

