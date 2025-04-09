import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/logout",
                { withCredentials: true }
            );
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;


