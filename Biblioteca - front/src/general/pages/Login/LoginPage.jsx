
import LoginForm from "@/general/pages/Login/LoginForm";

import portada from '../../../img/Biblio.png';


const LoginPage = () => {
   

    return (
        <div className="h-screen flex flex-row">
            <img src={portada} alt="portada" className="w-1/2 hidden md:block" />
            <div className="flex flex-col w-full">
                <LoginForm/>

            </div>
        </div>
    );
};

export default LoginPage;