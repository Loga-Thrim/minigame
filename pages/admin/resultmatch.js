import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import axios from 'axios';

import { AiTwotoneDelete } from 'react-icons/ai';
import { IoMdFootball, IoIosClose } from 'react-icons/io';
import { userState } from '../../components/userState';
import LoginCheck from '../../components/loginCheck';
import Navbar from '../../components/adminNavbar';

export default function admin() {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const [list, setList] = useState([]);
    const [selectDisplay, setSelectDisplay] = useState("none");
    const [selectId, setSelectId] = useState("");

    useEffect(()=>{
        if(user.name) if(user.rights != "admin" && user.rights != "superadmin") router.push("/");
    }, [user.name])

    function getchMatch(){
        axios.get(`${process.env.URL_API}/getmatch-all-admin`).then(res=>{
            setList(res.data.matchs);
        })
    }

    useEffect(()=>{
        getchMatch();
    }, [selectDisplay])

    function deleteMatch(id){
        axios.delete(`${process.env.URL_API}/deletematch/${id}`).then(res=>{
            getchMatch();
        })
    }

    return (
        <>
            <LoginCheck></LoginCheck>

            {user.name ? 
            <>
                <Navbar></Navbar>
                <SelectResult display={selectDisplay} handleDisplay={e=>setSelectDisplay(e)}
                id={selectId}></SelectResult>

                <div className="container">
                    <div className="contentBox">
                        <table>
                            <thead>
                                <tr>
                                    <th>ทีม</th>
                                    <th>วันที่</th>
                                    <th>เวลา</th>
                                    <th>รายงานผล</th>
                                    <th>ลบ</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                list.map((item, index)=>
                                    <tr key={index}>
                                        <td>{item.team1.name} vs {item.team2.name}</td>
                                        <td>{item.date}</td>
                                        <td>{item.time}</td>
                                        {
                                        !item.team_win ?
                                            <td><IoMdFootball style={{cursor: 'pointer'}} size={20} onClick={()=>{
                                                setSelectDisplay("flex");
                                                setSelectId(item._id);
                                            }} /></td>
                                        : <td>{item.team_win==1?"ทีมเจ้าบ้าน":item.team_win==2?"ทีมเยือน":
                                        item.team_win==3?"เสมอ":null}</td> }
                                        {
                                        !item.team_win?
                                        <td><AiTwotoneDelete style={{cursor: 'pointer'}} size={20} 
                                        onClick={()=>deleteMatch(item._id)} /></td>
                                        : <td></td>
                                        }
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
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
                }
                .contentBox{
                    position: relative;
                    width: 85%;
                    height: auto;
                }
                table{
                    width: 100%;
                    background: white;
                    border-collapse: collapse;
                    border-spacing: 0;
                }
                tr th, tr td{
                    padding: 10px 0;
                    border-right: 1px solid rgba(0, 0, 0, .2);
                    border-bottom: 1px solid rgba(0, 0, 0, .2);
                    text-align: center;
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
                    tr th, tr td{
                        font-size: 14px;
                    }
                }
            `}</style>
        </>
    )
}

const SelectResult = ({id, display, handleDisplay})=>{
    const wrapperRef = useRef(null);
    const [team, setTeam] = useState(0);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                handleDisplay("none");
                setTeam(0);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    function submit(){
        if(team){
            axios({
                url: `${process.env.URL_API}/resultmatch`,
                method: "POST",
                data: {id, team}
            }).then(res=>{
                handleDisplay("none");
            })
        }
    }

    return(
        <div className="container">
            <div className="contentBox" ref={wrapperRef}>
                <div style={{width: '100%'}}>
                    <IoIosClose style={{color: "white", float: 'right', cursor: 'pointer'}} size={50}
                    onClick={()=>handleDisplay("none")} />
                </div>
                <span onClick={()=>setTeam(1)} className={team==1?'active':null}>ทีมเจ้าบ้าน</span>
                <span onClick={()=>setTeam(3)} className={team==3?'active':null}>เสมอ</span>
                <span onClick={()=>setTeam(2)} className={team==2?'active':null}>ทีมเยือน</span> <br/>
                <button type="button" style={{background: team ? "#EF413B" : "rgb(200, 200, 200)"}}
                onClick={submit}>ยืนยัน</button>
            </div>

            <style jsx scoped>{`
                .container{
                    position: fixed;
                    top: 0;
                    width: 80%;
                    right: 0;
                    height: 100vh;
                    background: rgba(0, 0, 0, .9);
                    display: ${display};
                    align-items: center;
                    justify-content: center;
                    animation: alert 1s;
                    z-index: 99999;
                }
                .contentBox{
                    width: 50%;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                }
                span{
                    width: 100%;
                    text-align: center;
                    color: white;
                    font-size: 24px;
                    padding: 30px 0;
                    cursor: pointer;
                    transition: .2s;
                }
                span:hover{
                    background: orange;
                }
                span.active{
                    background: orange;
                }
                button{
                    padding: 30px;
                    font-size: 24px;
                    width: 100%;
                    color: white;
                    position: relative;
                    margin-left: auto;
                    margin-right: auto;
                    border: 0;
                    cursor: pointer;
                    transition: .2s;
                }

                @media only screen and (max-width: 800px){
                    .container{
                        width: 100%;
                        align-items: flex-start;
                        padding-top: 50px;
                    }
                    .contentBox{
                        width: 80%;
                    }
                    span, button{
                        font-size: 18px;
                        padding: 20px 0;
                    }
                }

                @keyframes alert{
                    from{
                        top: -100%;
                    }
                    to{
                        top: 0%;
                    }
                }
            `}</style>
        </div>
    )
}