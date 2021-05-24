import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';

import { userState } from '../../components/userState';
import LoginCheck from '../../components/loginCheck';
import Navbar from '../../components/adminNavbar';
import axios from 'axios';
import swal from 'sweetalert';

export default function admin() {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const [uploadpic1, setUploadpic1] = useState(null);
    const [uploadpic2, setUploadpic2] = useState(null);
    const [team1, setTeam1] = useState({
        name: "",
        score: ""
    })
    const [team2, setTeam2] = useState({
        name: "",
        score: ""
    })
    const [draw, setDraw] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [imgsrc, setImgsrc] = useState({
        img1: "",
        img2: ""
    })

    useEffect(()=>{
        if(user.name) if(user.rights != "admin" && user.rights != "superadmin") router.push("/");
    }, [user.name]) 

    function choosePic1(e){
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            setImgsrc({...imgsrc, img1: [reader.result]})
        }
        setUploadpic1(file);
        e.target.value = null;
    }
    function choosePic2(e){
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            setImgsrc({...imgsrc, img2: [reader.result]})
        }
        setUploadpic2(file);
        e.target.value = null;
    }

    function sendPic(e){
        e.preventDefault();
        const formData = new FormData();

        if(uploadpic1!=null && uploadpic2!=null){
            if(team1.name && team1.score && team2.name && team2.score && draw && time!="" && date!=""){
                formData.append("img", uploadpic1);
                formData.append("img", uploadpic2);
    
                axios.post(`${process.env.URL_API}/imgupload`, formData).then(result=>{
                    if(result.data.status=="success"){
                        let dataInsert = {
                            team1_name: team1.name,
                            team2_name: team2.name,
                            team1_score: team1.score,
                            team2_score: team2.score,
                            draw_score: draw,
                            time,
                            date,
                            img1: result.data.filesName[0],
                            img2: result.data.filesName[1]
                        }
                        axios.post(`${process.env.URL_API}/addmatch`, dataInsert, {
                            "Content-Type": "application/json"
                        }).then(result=>{
                            try{
                                if(result.data.status == "success"){
                                    swal({
                                        icon: "success",
                                        title: "เพิ่มข้อมูลสำเร็จ"
                                    }).then(()=>{
                                        setTeam1({name: "", score: ""});
                                        setTeam2({name: "", score: ""});
                                        setDraw("");
                                        setImgsrc({img1: "", img2: ""});
                                        setUploadpic1(null);
                                        setUploadpic2(null);
                                        setTime("");
                                        setDate("");
                                    })
                                }
                            } catch(e){
                                swal({
                                    icon: "error",
                                    title: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล"
                                })
                            }
                        })
                    } else{
                        swal({
                            icon: "error",
                            title: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล"
                        })
                    }
                })
            } else {
                swal({
                    icon: "warning",
                    title: "ระบุข้อมูลให้ครบถ้วน"
                })
            }
        } else{
            swal({
                icon: "warning",
                title: "เพิ่มรูปภาพให้ครบถ้วน"
            })
        }
    }

    return (
        <>
            <LoginCheck></LoginCheck>

            {user.name ? 
            <>
                <Navbar></Navbar>
                <div className="container">
                    <div className="contentBox">
                        <div className="row">
                            <div className="column">
                                <div className="boxImg1">
                                    <img src={imgsrc.img1} className="img" alt=""/>
                                </div><br/>
                                
                                <input type="file" className="inputname" id="imgUpload1"
                                onChange={choosePic1} />
                                <label htmlFor="imgUpload1">เพิ่มรูปภาพ</label> <br/>
                                <div style={{width: '100%', textAlign: 'left'}}><span>ชื่อทีมเจ้าบ้าน</span></div> <br/>
                                <input type="text" value={team1.name} 
                                onChange={e=>setTeam1({...team1, name: e.target.value})} name="teamName1" /> <br/>
                                <div style={{width: '100%', textAlign: 'left'}}><span>คะแนน</span></div> <br/>
                                <input type="text" value={team1.score} 
                                onChange={e=>setTeam1({...team1, score: e.target.value})} name="teamScore1" /> 
                            </div> <br/><br/>
                            <div className="column">
                                <div className="boxImg2">
                                    <img src={imgsrc.img2} className="img" alt=""/>
                                </div><br/>                                
                                <input type="file" className="inputname" id="imgUpload2"
                                onChange={choosePic2} />
                                <label htmlFor="imgUpload2">เพิ่มรูปภาพ</label> <br/>
                                <div style={{width: '100%', textAlign: 'left'}}><span>ชื่อทีมเยือน</span></div> <br/>
                                <input type="text" value={team2.name} 
                                onChange={e=>setTeam2({...team2, name: e.target.value})} name="teamName2" /> <br/>
                                <div style={{width: '100%', textAlign: 'left'}}><span>คะแนน</span></div> <br/>
                                <input type="text" value={team2.score} 
                                onChange={e=>setTeam2({...team2, score: e.target.value})} name="teamScore2" />
                            </div>
                        </div> <br/><br/><br/>

                        <div className="row">
                            <div className="column">
                                <h1>เสมอ</h1>
                                <span style={{paddingTop: 13}}></span>
                                <div style={{width: '100%', textAlign: 'left'}}>
                                    <span>คะแนน</span>
                                </div> <br/>
                                <input type="text" onChange={e=>setDraw(e.target.value)} name="draw"
                                value={draw} /> <br/>
                            </div>
                            <div className="column">
                                <div style={{width: '100%', textAlign: 'left'}}><span>วันที่แข่งขัน</span></div> <br/>
                                <input type="date" onChange={e=>setDate(e.target.value)} name="date" 
                                value={date} style={{padding: 8}} /> <br/>
                                <div style={{width: '100%', textAlign: 'left'}}><span>เวลาที่แข่งขัน</span></div> <br/>
                                <input type="time" onChange={e=>setTime(e.target.value)} name="time" 
                                value={time} style={{padding: 8}} />
                                <br/><br/>
                                <button onClick={sendPic}>เพิ่มแมตซ์</button> 
                            </div>
                        </div>
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
                }
                .row{
                    display: flex;
                    flex-direction: row;
                    margin: 0;
                    padding: 0;
                }
                .column{
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    align-items: center;
                }
                .column .boxImg1, .column .boxImg2{
                    width: 40%;
                    height: 80px;
                    border-radius: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    background: rgb(30, 30, 60);
                }
                .column .boxImg1{
                    background: ${imgsrc.img1 ? 'rgb(10, 10, 30)' : null};
                }
                .column .boxImg2{
                    background: ${imgsrc.img2 ? 'rgb(10, 10, 30)' : null};
                }
                .img{
                    max-width: 100%;
                    position: absolute;
                    box-sizing: border-box;
                    max-height: 80px;
                }
                .column h1{
                    margin: 0;
                    padding: 0;
                    font-size: 24px;
                    display: flex;
                    align-items: center;
                    color: white;
                }
                .column span{
                    color: white;
                    margin-left: 10%;
                    font-size: 16px;
                }
                .column .inputname{
                    display: none;
                }
                input{
                    width: 80%;
                    font-size: 16px;
                    padding: 10px;
                    border: 0;
                    border-radius: 3px;
                    outline-color: rgb(100, 100, 200);
                }
                label{
                    cursor: pointer;
                    background: orange;
                    padding: 10px 0;
                    width: 80%;
                    color: white;
                    text-align: center;
                }
                button{
                    cursor: pointer;
                    margin-top: 5px;
                    width: 80%;
                    padding: 15px 0;
                    color: white;
                    background: rgb(70, 120, 255);
                    border: 0;
                    border-radius: 5px;
                    outline: none;
                    font-size: 16px;
                    transition: .1s;
                }
                button:hover{
                    background: rgb(40, 70, 150);
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
                    }
                }

                @media only screen and (max-width: 460px){
                    .contentBox{
                        width: 100%;
                    }
                    .row{
                        flex-direction: column;
                        line-height: 15px;
                    }
                    .column .boxImg1, .column .boxImg2{
                        height: 50px;
                        width: 30%;
                    }
                    .img{
                        max-width: 100%;
                        max-height: 50px;
                    }
                    .column h1{
                        font-size: 24px;
                        display: flex;
                        align-items: center;
                    }
                    .column span{
                        margin-left: 15%;
                        font-size: 14px;
                    }
                    input{
                        width: 70%;
                        font-size: 14px;
                        padding: 5px;
                    }
                    label{
                        padding: 5px 0;
                        width: 70%;
                        font-size: 14px;
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

