import client from '../axios/client.js'
import Login from './login.jsx';
import hankkiLogo from '../assets/logos/Hankki_logo.png';

function Home({loggedIn, setLoggedIn}) {
    // client.get()
    // .then((s) => {
    //     console.log(s);
    // })
    
    return (
        <>
        <div id='landing-page'>
            <div id='landing-left' className='landing-halve'>
                <div id="logo-container">
                    <img id="logo" src={hankkiLogo} alt="Hankki_logo"></img>
                </div>
                <p>This is totally not a facebook rip off.</p>
            </div>
            <div id='landing-right' className='landing-halve'>
                <Login 
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}  
                />
            </div>
        </div>
        </>
    )
}

export default Home; 