import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { userState } from '../components/userState';
import { useRecoilValue } from 'recoil';
import LoginCheck from '../components/loginCheck';
import { FaUserAlt, FaPhoneSquareAlt } from 'react-icons/fa';
import { ImUserPlus } from 'react-icons/im';
import { IoIosLock } from 'react-icons/io';
import Layout from '../components/Layout';

export default function register() {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const [register, setRegister] = useState({
        name: "",
        phoneNumber: "",
        password: ""
    });
    const [choosePic, setChoosePic] = useState(null);
    const [pPic, setPPic] = useState(null);

    useEffect(()=>{
        if(user.phoneNumber) router.push("/");
    }, [user.phoneNumber])

    function fRegister(e){
        e.preventDefault();
        const { name, phoneNumber, password } = register;
        const formData = new FormData();
        formData.append("img", choosePic);

        function registerData(fileName){
            axios({
                method: "POST",
                url: `${process.env.URL_API}/register`,
                headers: {"Content-Type": "application/json"},
                data: JSON.stringify({
                    name, phoneNumber, password, img: fileName
                })
            }).then(res=>{
                try{
                    if(res.data.status == "success"){
                        localStorage.setItem("token", res.data.token);
                        router.push("/");
                    } else{
                        alert("เบอร์โทรนี้มีผู้ใช้งานแล้ว กรุณาลองใหม่อีกครั้ง");
                    }
                } catch(e){
                    alert("สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่ภายหลัง");
                }
            })
        }

        if(name && phoneNumber && password){
            if(choosePic) {
                axios.post(`${process.env.URL_API}/imgupload`, formData).then(res=>{
                    registerData(res.data.filesName);
                }).catch(e=>{
                    alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
                })
            } else registerData("");
        } else alert("โปรดกรอกข้อมูลให้ครบ");
    }

    function chooseImg(e){
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            setPPic([reader.result])
        }
        setChoosePic(file);
        e.target.value = null;
    }

    return (
        <Layout bg="/images/bg_login.jpg">
            <LoginCheck></LoginCheck>

            <form onSubmit={fRegister} className="form">
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    {
                        pPic ? 
                        <>
                            <label htmlFor="img-profile" className="pPic"></label>
                            <input type="file" id="img-profile" style={{display: 'none'}} onChange={chooseImg} />
                        </> :
                        <>
                            <label htmlFor="img-profile" className="circle">อัพโหลดรูปภาพ</label>
                            <input type="file" id="img-profile" style={{display: 'none'}} onChange={chooseImg} />
                        </>
                    }
                </div> <br/>

                <div className="boxInput">
                    <FaUserAlt style={{color: 'white', background: 'black', width: '13%', height: '90%',
                    borderRadius: 5}} />
                    <input type="text" name="phoneNumber" placeholder="Name" className="input"
                    onChange={e=>setRegister({...register, name: e.target.value})} />
                </div>
                <br/>

                <div className="boxInput">  
                    <FaPhoneSquareAlt style={{color: 'white', background: 'black', width: '13%',
                    height: '90%', borderRadius: 5}} />
                    <input type="text" name="password" placeholder="Mobile Number" className="input"
                    onChange={e=>setRegister({...register, phoneNumber: e.target.value})} /> <br/><br/>
                </div> <br />

                <div className="boxInput">  
                    <IoIosLock style={{color: 'white', background: 'black', width: '13%',
                    height: '90%', borderRadius: 5}} />
                    <input type="password" name="password" placeholder="Password" className="input"
                    onChange={e=>setRegister({...register, password: e.target.value})} /> <br/><br/>
                </div> <br />

                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <button type="submit" className="btn">
                    <div style={{border: '2px solid white', borderRadius: '50%', width: 30, height: 30,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <ImUserPlus style={{color: 'white'}} />
                        </div>
                        <span className="txt">REGISTER</span>
                    </button>
                </div>
            </form>

            <img src="/images/bg_register_logo.png" className="logo" alt="" />

            {/* 
                <span>Mobile Number</span> <br/>
                <input type="text" name="phoneNumber" className="input"
                onChange={e=>setRegister({...register, phoneNumber: e.target.value})} /> <br/><br/>
                <span>Password</span> <br/> 
                <input type="password" name="password" className="input"
                onChange={e=>setRegister({...register, password: e.target.value})} /> <br/><br/>

                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <button type="submit" className="btn">REGISTER</button>
                </div>
            </form> */}
            
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
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-size: 14px;
                }
                .pPic{
                    background: url(${pPic});
                    background-size: cover;
                    background-position: center;
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
                    background: linear-gradient(#ffa2a2, #db0000);
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
