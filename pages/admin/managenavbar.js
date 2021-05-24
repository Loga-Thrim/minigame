import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { userState } from '../../components/userState';
import LoginCheck from '../../components/loginCheck';
import Navbar from '../../components/adminNavbar';
import axios from 'axios';
import swal from 'sweetalert';

export default function Managenavbar() { 
    const user = useRecoilValue(userState);
    const [navbar, setNavbar] = useState({
        name: "",
        url: ""
    })

    useEffect(()=>{
        axios.get(`${process.env.URL_API}/navbar-custom`).then(res=>{
            if(res.data.navbar) setNavbar(res.data.navbar);
        })
    }, [])

    function submit(){
        axios({
            method: "PUT",
            url: `${process.env.URL_API}/navbar-custom`,
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(navbar)
        }).then(res=>{ 
            swal({
                icon: "success",
                title: "ตั้งค่า Navbar สำเร็จ!"
            })
        }).catch(e=>{
            swal({
                icon: "error",
                title: "เกิดข้อผิดในการตั้งค่าข้อมูล ลองใหม่อีกครั้งภายหลัง"
            })
        })
    }

    return (
        <>
            <LoginCheck></LoginCheck>

            {user.name ? 
            <>
                <Navbar></Navbar>
                <div className="container">
                    <div className="contentBox">
                        <h1>ตั้งค่าปุ่ม Navbar</h1> <br /><br />
                        <h3>ชื่อปุ่ม</h3>
                        <input type="text" value={navbar.name} onChange={e=>setNavbar({...navbar,
                        name: e.target.value})} /> <br /><br />
                        <h3>ลิงค์ URL</h3>
                        <input type="text" value={navbar.url} onChange={e=>setNavbar({...navbar,
                        url: e.target.value})} /> <br /><br /><br />
                        <button type="button" onClick={submit}>ยืนยัน</button>
                    </div>
                </div>
            </> : null}

            <style jsx>{`
                .container{
                    padding: 20px 0;
                    position: relative;
                    width: 80%;
                    background: rgb(10, 10, 30);
                    min-height: 100vh;
                    float: right;
                    display: flex;
                    justify-content: center;
                    line-height: 15px;
                    min-height: 100vh;
                }
                .contentBox{
                    position: relative;
                    width: 75%;
                    height: auto;
                    color: white;
                }
                input{
                    border: 0;
                    padding: 10px;
                    border-radius: 5px;
                    outline: lightblue;
                    width: 50%;
                    font-size: 18px;
                }
                button{
                    color: white;
                    background: orange;
                    border: 0;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 50%;
                    font-size: 18px;
                    padding: 10px;
                }
                button:hover{
                    background: #FF5900;
                }

                @media only screen and (max-width: 800px){
                    .container{
                        padding: 20px 0;
                        margin-top: 45px;
                        float: none;
                        width: 100%;
                        line-height: 15px;
                    }
                    .contentBox{
                        width: 90%;
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                    }
                }

                @media only screen and (max-width: 460px){
                    .contentBox{
                        width: 100%;
                    }
                    input{
                        width: 70%;
                        font-size: 14px;
                        padding: 5px;
                    }
                    button{
                        margin-top: 5px;
                        width: 70%;
                        padding: 10px 0;
                        font-size: 14px;
                    }
                }
            `}</style>
        </>
    )
}
