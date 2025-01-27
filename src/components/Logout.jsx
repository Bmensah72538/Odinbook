import { useEffect, useState } from "react";
import { useUserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import client from '../tools/axiosClient';

const Logout = () => {
    const [loading, setLoading] = useState(false);
    const { user, logout } = useUserContext();
    const navigate = useNavigate();
    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            console.log('Navigated to home')
        } catch (error) {
            console.error('Failed to log out. Error: ', error);
        }
    }
    useEffect(() => {
        if(!user) {
            navigate('/');
        }
    }, [user]);

    return (
        <>
        <button onClick={handleLogout}>{loading ? ('Logging out...') : ('Log out')}</button>
        </>
    )
}

export default Logout;