import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ loginUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    loginUser({
      username,
      password,
    })
    setUsername('')
    setPassword('')
  }

  return (
      <div>
        <h2>Login</h2>
        
        <form onSubmit={handleLogin}>
            <TextField style={{ marginTop: 10 }}
              label="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              />
            <br></br>
            <TextField style={{ marginTop: 10 }}
              label="password"
              value={password}
              onChange={({ target}) => setPassword(target.value)}
            />
            <div>
              <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
                login
              </Button>
            </div>
        </form>
    </div>
  )
}

export default LoginForm