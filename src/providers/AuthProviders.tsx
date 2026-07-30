"use client";

import { AuthContextType, IUser } from "@/app/features/auth/types";
import { getCurrentUserAction } from "@/app/(auth)/_action/getCurrentUserAction";
import { createContext, ReactNode, useEffect, useState } from "react";


export const AuthContext = createContext<AuthContextType | null>(null);



const AuthProvider = ({
    children
}: {
    children: ReactNode
}) => {

    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    const getUser = async() =>{
      try{
          const res = await getCurrentUserAction()
        if(!res || !res.ok || !res.data?.data){
            setUser(null)
        } else {
            setUser(res.data.data)
        }
      }catch(error){
        setUser(null)
      }finally {
    setLoading(false);
  }

    }



useEffect(() => {
  getUser();
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




