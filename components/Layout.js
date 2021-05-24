import React from 'react';
import Navbar from './Navbar';
import { useRecoilState } from 'recoil';
import { userState } from '../components/userState';
import { useRouter } from 'next/router';
import { ImUserMinus, ImUserPlus }  from 'react-icons/im'

export default function Layout(props) {
    const [user, setUser] = useRecoilState(userState);
    const router = useRouter();
    function logout(){
        localStorage.removeItem("token");
        setUser({});
        router.push("/");
    }

    return (
        <div className="container">
            <img src="/images/ff_logo1.png" alt="" className="logo" /> 
            {
                user.phoneNumber ?
                <>
                <button type="button" onClick={logout} className="btn-logout">
                <div style={{border: '2px solid white', borderRadius: '50%', width: 20, height: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <ImUserMinus style={{color: 'white'}} />
                    </div>
                    <span className="txt">LOGOUT</span>
                </button>
                </> : (router.pathname != "/register" && router.pathname != "/login") ?
                <>
                    <button type="button" onClick={()=>router.push("/register")} className="btn-logout">
                    <div style={{border: '2px solid white', borderRadius: '50%', width: 20, height: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <ImUserPlus style={{color: 'white'}} />
                        </div>
                        <span className="txt">REGISTER</span>
                    </button>
                </> : null
            }

            {props.children}
            <Navbar></Navbar>

            <style jsx>{`
                .container{
                    position: relative;
                    margin-left: auto;
                    margin-right: auto;
                    background: url(${props.bg});
                    background-size: cover;
                    background-repeat: no-repeat;
                    width: 100%;
                    max-width: 800px;
                    min-height: 100vh;
                    max-height: 100vh;
                    padding: 0px 0;
                    overflow: hidden;
                }
                .logo{
                    width: 25%;
                    height: auto;
                    position: absolute;
                    top: 25px;
                    left: 25px;
                }
                .btn-logout{
                    color: white;
                    background: linear-gradient(#ffa2a2, #db0000);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid white;
                    border-radius: 20px;
                    cursor: pointer;
                    position: absolute;
                    top: 25px;
                    right: 25px;
                    z-index: 52;
                }
                .txt{
                    font-size: 14px;
                    padding: 0 5px;
                }

                @media only screen and (max-width: 500px){
                    .txt{
                        font-size: 11px;
                        padding: 0 5px;
                    }
                }
            `}</style>
        </div>
    )
}
