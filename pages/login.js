import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaUserAlt } from 'react-icons/fa';
import { ImUserPlus } from 'react-icons/im';
import { IoIosLock, IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';
import { userState } from '../components/userState';
import { useRecoilValue } from 'recoil';
import LoginCheck from '../components/loginCheck';
import Layout from '../components/Layout';

export default function auth() {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    useEffect(()=>{
        if(user.phoneNumber) router.push("/");
    }, [user.phoneNumber])

    function fLogin(e){
        e.preventDefault();

        if(phoneNumber && password){
            axios.post(`${process.env.URL_API}/login`, {
                phoneNumber,
                password
            }, {
                "Content-Type": "application/json"
            }).then(res=>{
                if(res.data.status == "success"){
                    localStorage.setItem("token", res.data.token);
                    router.push("/");
                } else{
                    setPhoneNumber("");
                    setPassword("");
                    alert("เบอร์โทรศัพท์ หรือ Password ไม่ถูกต้อง")
                }
            })
        } else{
            alert("โปรดระบุข้อมูลให้ครบ")
        }
    }
    return (
        <Layout bg="/images/bg_login.jpg">
            <LoginCheck />
            <form onSubmit={fLogin} className="form">
                <div className="boxInput">
                    <FaUserAlt style={{color: 'white', background: 'black', width: '13%', height: '90%',
                    borderRadius: 5}} />
                    <input type="text" name="phoneNumber" placeholder="Mobile Number" className="input"
                    onChange={e=>setPhoneNumber(e.target.value)} value={phoneNumber} />
                </div>
                <br/>

                <div className="boxInput">  
                    <IoIosLock style={{color: 'white', background: 'black', width: '13%',
                    height: '90%', borderRadius: 5}} />
                    <input type="password" name="password" placeholder="Password" className="input"
                    onChange={e=>setPassword(e.target.value)} value={password} /> <br/><br/>
                </div> <br />

                <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                    <div style={{flex: 1, }}>
                        <button type="submit" className="btn">
                            <div style={{border: '2px solid white', borderRadius: '50%', width: 30, height: 30,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <IoIosArrowBack style={{color: 'white'}} />
                            </div>
                            <span className="txt">LOGIN</span>
                        </button>
                    </div>

                    <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                        <button type="button" onClick={()=>router.push("/register")} className="btn"
                        style={{background: 'linear-gradient(#ffa2a2, #db0000)'}}>
                        <div style={{border: '2px solid white', borderRadius: '50%', width: 30, height: 30,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <ImUserPlus style={{color: 'white'}} />
                            </div>
                            <span className="txt">REGISTER</span>
                        </button>
                    </div>
                </div>
            </form>

            <img src="/images/bg_login_logo.png" className="logo" alt="" />

            <style jsx>{`
                .logo{
                    position: fixed;
                    bottom: 60px;
                    width: 100%;
                    max-width: 800px;
                    left: 50%;
                    transform: translate(-50%, 0);
                    z-index: 2;
                }
                .form{
                    margin-left: auto;
                    margin-right: auto;
                    width: 50%;
                    height: 100%;
                    padding: 30px 0;
                    padding-top: 150px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    line-height: 20px;
                    position: relative;
                    z-index: 50;
                }
                .circle{
                    background: white;
                    width: 130px;
                    height: 130px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                span{
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                    letter-spacing: .3px;
                }
                .boxInput{
                    background: white;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    border-radius: 5px;
                }
                .input{
                    width: 85%;
                    border: 2px solid rgb(230, 230, 230);
                    padding: 15px 15px;
                    background: white;
                    color: black;
                    font-size: 20px;
                    outline: none;
                    border: 0;
                }
                .btn{
                    color: white;
                    background: linear-gradient(#a2e4a9, #009100);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid white;
                    border-radius: 20px;
                    cursor: pointer;
                }
                .txt{
                    font-size: 20px;
                    padding: 0 10px;
                }

                @media only screen and (max-width: 500px){
                    .form{
                        width: 70%;
                    }
                    .input{
                        padding: 10px 5px;
                        font-size: 16px;
                    }
                    .btn{
                        font-size: 16px;
                    }
                    .txt{
                        font-size: 16px;
                        font-weight: normal;
                        padding: 0 3px;
                    }
                    .logo{
                        bottom: 40px;
                    }
                }
            `}</style>
        </Layout>
    )
}
