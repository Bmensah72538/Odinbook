import client from '../axios/client.js'
import { useState } from 'react'

function Login(){
    const [ credentials, setCredentials ] = useState({
        username: '',
        password: ''
    })

    const handleSubmit = async function(e){
        e.preventDefault();
        const username = e.target['0'].value;
        const password = e.target['1'].value;

        setCredentials({
            username: username,
            password: password
        })

        console.log(`Username: ${username} Password: ${password}`)
        try {
            const response = await client.post('/api/login', {
                username: username,
                password: password
            })
            console.log(response)
            const accessToken = response.data.access.token.split(' ')[1];
            const refreshToken = response.data.refresh.token.split(' ')[1];

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken)

        } catch (error){
            console.log(error)
        }
    }
    const testJWT = async function(e) {
        const response = await client.get('/api/messages')
        console.log(response);
    }
    
    return (
        <>
        <div className="login">
            <form onSubmit={handleSubmit} action="" method="post">
                <label htmlFor="username">
                    Username:
                </label>
                <input type="text" name="username" id="username" required />
                <label htmlFor="password">
                    Password:
                </label>
                <input type="password" name="password" id="password" required />
                <button type="submit">Submit</button>
            </form>

            <button onClick={testJWT}>Click</button>
        </div>
        </>
    )
}

export default Login;