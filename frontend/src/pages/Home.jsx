import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    let role;
    if (user && user.role) {
        role = user.role
    }
    useEffect(() => {
        if (!role) return;
        if (role === "Sponsoree") {
            navigate("/sponsors");
        } else if (role === "Sponsor") {
            navigate("/list-approval-proposal");
        } else if (role === "Admin"){
            navigate("/list-users")
        }
    }, [role, navigate]);
};

export default Home;