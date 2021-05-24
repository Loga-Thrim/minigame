import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoIosLock } from 'react-icons/io';
import axios from 'axios';
import { userState } from '../../components/userState';
import { useRecoilValue } from 'recoil';
import LoginCheck from '../../components/loginCheck';

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
        axios.post(`${process.env.URL_API}/login-admin`, {
            phoneNumber,
            password
        }, {
            "Content-Type": "application/json"
        }).then(res=>{
            if(res.data.status == "success"){
                localStorage.setItem("token", res.data.token);
                router.push("/admin/addmatch");
            } else{
                setPhoneNumber("");
                setPassword("");
                alert("เบอร์โทรศัพท์ หรือ Password ไม่ถูกต้อง")
            }
        })
    }
    return (
        <div className="container">
            <LoginCheck />
            <form onSubmit={fLogin} className="form">
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <div className="circle-out">
                        <div className="circle-in"></div>
                    </div>
                </div> <br/><br/>
                <div style={{width: '100%', textAlign: 'center'}}>
                    <h1 style={{color: 'white'}}>Admin Login</h1> 
                </div>
                <br/>
                <span>Mobile Number</span> <br/>
                <input type="text" name="phoneNumber" className="input"
                onChange={e=>setPhoneNumber(e.target.value)} value={phoneNumber} />  <br/>
                <span>Password</span> <br/>
                <input type="password" name="password" className="input"
                onChange={e=>setPassword(e.target.value)} value={password} /> <br/><br/>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <button type="submit" className="btn">
                        <IoIosLock size={30} /> &nbsp;LOGIN
                    </button>
                </div>
            </form>

            <style jsx>{`
                .container{
                    position: relative;
                    margin-left: auto;
                    margin-right: auto;
                    background: url('/images/2000.jpg');
                    background-size: cover;
                    background-repeat: no-repeat;
                    width: 100%;
                    max-width: 800px;
                    min-height: 100vh;
                }
                .form{
                    margin-left: auto;
                    margin-right: auto;
                    width: 90%;
                    height: 100%;
                    padding: 30px 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    line-height: 20px;
                }
                .circle-out{
                    background: linear-gradient(#f8e195, #bd9341, #f8e195, #f8e195);
                    width: 130px;
                    height: 130px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .circle-in{
                    background: black;
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                }
                span{
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                    letter-spacing: .3px;
                }
                .input{
                    width: 100%;
                    border: 5px solid #463822;
                    padding: 15px 5px;
                    background: #09050e;
                    color: white;
                    font-size: 20px;
                }
                .btn{
                    font-size: 20px;
                    padding: 15px 0;
                    width: 80%;
                    background: linear-gradient(to right, #bd9341, #f8e195,  #bd9341);
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    )
}
