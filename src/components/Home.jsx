import client from '../tools/client.js'
import Login from './Login.jsx';
import hankkiLogo from '../assets/logos/Hankki_logo.png';
import styles from './Home.module.css'

function Home({loggedIn, setLoggedIn}) {
    // client.get()
    // .then((s) => {
    //     console.log(s);
    // })
    
    return (
        <>
        <div className={styles.container}>
            <div id='landing-page'>
                <div id='landing-left' className='landing-halve'>
                    <div id="logo-container">
                        <img id="logo" src={hankkiLogo} alt="Hankki_logo"></img>
                    </div>
                    <p>This is a work in progress!</p>
                </div>
                <div id='landing-right' className='landing-halve'>
                    <Login 
                        loggedIn={loggedIn}
                        setLoggedIn={setLoggedIn}  
                    />
                </div>
            </div>
        </div>
        </>
    )
}

export default Home; 