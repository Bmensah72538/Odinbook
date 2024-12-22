import { useState } from "react";
import { useUserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import client from '../tools/axiosClient';

const Logout = () => {
    const [loading, setLoading] = useState(false);
    const { user, logout } = useUserContext();
    const navigate = useNavigate();
    const handleLogout = async () => {
        console.log('Begin logout...')
        setLoading(true);
        logout();
        try {
            navigate('/');
            const response = await client.post('/api/logout', user); 
        } catch (error) {
            console.log('Failed to logout.');
            alert('Failed to logout. Please try again.')
            return;
        } finally {
            console.log('End logout.')
            setLoading(false);
        }
    }

    return (
        <>
        <button onClick={handleLogout}>{loading ? ('Logging out...') : ('Log out')}</button>
        </>
    )
}

export default Logout;