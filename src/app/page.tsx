'use client'
import './globals.css';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from 'axios'

export default function AuthPage() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userId || !password) {
      setError('User ID and password are required')
      return
    }

    try {
      // Make a POST request to the backend to validate the login
      const response = await axios.post('http://localhost:5000/api/login', {
        userId,
        password,
      })
      
      if (response.data.success) {
        router.push('/dashboard') // Redirect to dashboard on success
      } else {
        setError('Invalid UserID or Password')
      }
    } catch (err) {
      setError('Error logging in. Please try again.')
      console.error(err)
    }
  }

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userId || !password || !mobileNumber) {
      setError('All fields are required')
      return
    }

    try {
      // Make a POST request to the backend to register the user
      const response = await axios.post('http://localhost:5000/api/register', {
        userId,
        mobileNumber,
        password,
      })
      
      if (response.data.success) {
        router.push('/dashboard') // Redirect to dashboard after registration
      } else {
        setError('Error registering. Try again.')
      }
    } catch (err) {
      setError('Error registering user. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Login or create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginUserId">User ID</Label>
                  <Input 
                    id="loginUserId" 
                    type="text" 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input 
                    id="loginPassword" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registerUserId">User ID</Label>
                  <Input 
                    id="registerUserId" 
                    type="text" 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input 
                    id="registerPassword" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input 
                    id="mobileNumber" 
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">Register</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
       
      </Card>
    </div>
  )
}
