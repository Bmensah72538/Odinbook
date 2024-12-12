import client from '../tools/client.js'
import { useState } from 'react'

function Signup({loggedIn, setLoggedIn}){
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
            if(response.data == "invalid username/password") {
                alert("Invalid username/password");
                return; 
            }
            const accessToken = response.data.access.token.split(' ')[1];
            const refreshToken = response.data.refresh.token.split(' ')[1];
            const userId = response.data.userId;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userId', userId);
            setLoggedIn('true');
        } catch (error){
            console.log(error)
        }
    }
    const testJWT = async function(e) {
        const response = await client.get('/api/messages')
        console.log(response);
        console.log(`Loggedin = ${loggedIn}`)
    }

    return (
        <>
        <div className="login">
            <form onSubmit={handleSubmit} action="" method="post">
                <div className='login-form'>
                    <input type="text" name="username" id="username" placeholder='Username' required />
                    <input type="password" name="password" id="password" placeholder='Password' required />
                    <button className="login-button" type="submit">Submit</button>
                </div>
            </form>
            <p>Logged in: {loggedIn}</p>
        </div>
        </>
    )
}

export default Signup;