
import React, {useEffect} from 'react'
import { useAuth } from '../context/AuthProvider'
import { useRouter } from 'next/router'

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const auth = useAuth();
  const router = useRouter();
  useEffect(() => {
    if(!auth.isAuthenticated ){
      router.push('/login')
    }
  }, [auth, router])
  return <>{auth.isAuthenticated ? children : null}</>
}

export default ProtectedRoute