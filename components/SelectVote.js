import React, { useState, useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import axios from 'axios';

const popupVoteState = atom({
  key: "popupVote",
  default: 'none'
})

export default function SelectVote({dataMatch, phoneNumber}) {
    const [display, setDisplay] = useRecoilState(popupVoteState);

    function selectTeam(team){        
        const { id, time, date } = dataMatch;
        const dataObj = { id, phoneNumber, team,  time, date};
        axios.post(`${process.env.URL_API}/predict`, dataObj, {
            "Content-Type": "application/json"
        }).then(res=>{
            if(res.data.status === "success"){
                setDisplay("none");
            }
        }).catch(e=>alert("เกิดข้อผิดพลาดในการทายผล ลองใหม่อีกครั้งภายหลัง"))
    }

    return (
        <div className="container">
            
            <div style={{width: '100%', float: 'left', marginTop: 30, marginLeft: 30}}>
                <span className="btnBack" onClick={()=>setDisplay("none")}>ย้อนกลับ</span> <br/><br/>
            </div> <br/><br/>

            <div className="btnBorder1">
                <button onClick={()=>selectTeam(1)}>เลือก เจ้าบ้าน</button>
            </div>
            <div sltye={{width: '100%', textAlign: 'center'}}>
                <span style={{color: 'white', fontSize: 14}}>{dataMatch.s_team1} คะแนน</span>
            </div>
            <hr/> <br/>

            <div className="btnBorder2">
                <button onClick={()=>selectTeam(3)}>เลือก เสมอ</button>
            </div> 
            <div sltye={{width: '100%', textAlign: 'center', background: 'red'}}>
                <span style={{color: 'white', fontSize: 14}}>{dataMatch.s_draw} คะแนน</span>
            </div>
            <hr/> <br/>

            <div className="btnBorder3">
                <button onClick={()=>selectTeam(2)}>เลือก ทีมเยือน</button>
            </div>
            <div sltye={{width: '100%', textAlign: 'center', background: 'red'}}>
                <span style={{color: 'white', fontSize: 14}}>{dataMatch.s_team2} คะแนน</span>
            </div>

            <style jsx>{`
                .container{
                    width: 100%;
                    height: 100vh;
                    position: absolute;
                    background: rgba(0, 0, 0, .9);
                    z-index: 99;
                    flex-direction: column;
                    align-items: center;
                    animation: slide 1s;
                    display: ${display};
                }
                button{
                    width: 200px;
                    font-size: 20px;
                    padding: 20px 0;
                    border-radius: 10px;
                    outline: none;
                    cursor: pointer;
                }
                hr{
                    width: 80%;
                    background: rgb(100, 100, 100);
                    height: 2px;
                    color: red; 
                    border: 0;
                }
                .btnBorder1 button{ background: linear-gradient(to right, #bd9341, #f8e195, #bd9341); }
                .btnBorder2 button{ background: linear-gradient(#bd9341, #f8e195); }
                .btnBorder3 button{ background: linear-gradient(#bd9341, #f8e195,  #bd9341); }

                .btnBack{
                    font-size: 16px;
                    background: red;
                    padding: 7px;
                    border-radius: 5px;
                    background: linear-gradient(to left, #bd9341, #f8e195);
                    cursor: pointer;
                }

                @keyframes slide{
                    from{
                        right: -100%;
                    } 
                    to{
                        right: 0%;
                    }
                }
                @keyframes slideBack{
                    from{
                        right: 0%;
                    }
                    to{
                        right: -100%;
                        display: none;
                    }
                }
            `}</style>
        </div>
    )
}
