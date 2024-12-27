import { useState } from "react";
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
            const heyThere = await logout();
        } catch (error) {
            console.error('Failed to log out. Error: ', error);
        } finally {
            setLoading(false);
            navigate('/');
        }
    }

    return (
        <>
        <button onClick={handleLogout}>{loading ? ('Logging out...') : ('Log out')}</button>
        </>
    )
}

export default Logout;