import { useEffect, useState } from 'react';
import axios from 'axios';
import LoginCheck from '../components/loginCheck';
import { userState } from '../components/userState';
import { useRecoilState } from 'recoil';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function Ranking() {
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();
  const [listUser, setListUser] = useState([]);

  useEffect(()=>{
    axios.get(`${process.env.URL_API}/user-rank`).then(res=>{
        setListUser(res.data.userSorted);
    }).catch(e=>{
        alert("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้")
    })
  }, [])

    function logout(){
        localStorage.removeItem("token");
        setUser({})
        router.push("/");
    }

  return (
    <>
      <Layout bg="/images/bg_ranking.jpg">
        <LoginCheck />

        <div className="container">
            <div style={{width: '100%', position: 'relative'}}>
                <img src="/images/logo_ranking.png" className="logo-rank" alt="" />

                <div className="one-pic" style={{
                    backgroundImage: listUser[0] ? listUser[0].pic ? `url(${process.env.ENDPOINT + "/" + 
                    process.env.BUCKET_NAME + "/" + listUser[0].pic[0]}` : null : null,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                }}></div>
                <div className="one-name">{listUser[0] ? listUser[0].name : null}</div>
                <div className="one-score">{listUser[0] ? listUser[0].score : null} POINT</div>

                <div className="two-pic" style={{
                    backgroundImage: listUser[1] ? listUser[1].pic ? `url(${process.env.ENDPOINT + "/" + 
                    process.env.BUCKET_NAME + "/" + listUser[1].pic[0]}` : null : null,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                }}></div>
                <div className="two-name">{listUser[1] ? listUser[1].name : null}</div>
                <div className="two-score">{listUser[1] ? listUser[1].score : null} POINT</div>

                <div className="three-pic" style={{
                    backgroundImage: listUser[2] ? listUser[2].pic ? `url(${process.env.ENDPOINT + "/" + 
                    process.env.BUCKET_NAME + "/" + listUser[2].pic[0]}` : null : null,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                }}></div>
                <div className="three-name">{listUser[2] ? listUser[2].name : null}</div>
                <div className="three-score">{listUser[2] ? listUser[2].score : null} POINT</div>
            </div>

            <div style={{width: '100%'}}>
                <img src="/images/table_rank.png" alt="" className="img-table" />
                <div className="box-content">
                    {
                        listUser.map((item, index)=>
                            index+1===1||index+1===2||index+1===3 ? null :
                            <div className="table" key={index}>
                                <span className="title">{index+1}</span>
                                <span className="imgP"><span className="circle" style={{
                                    background: item.pic ? `url(${process.env.ENDPOINT + "/" + 
                                    process.env.BUCKET_NAME + "/" + item.pic[0]}` : "white", backgroundSize: 'cover', 
                                    backgroundPosition: 'center'
                                }}></span></span>
                                <span className="date">{item.name}</span>
                                <span className="score">{item.score}</span>
                                <span className="txtPoint">POINT</span>
                            </div>
                        )
                    }
                    <br /><br />
                </div>
            </div>
        </div>
      </Layout>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap');
        ::-webkit-scrollbar { display: none; }
        .circle{
            background: white;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container{
            position: relative;
            width: 100%;
            margin-top: 50px;
            height: calc(100vh - 89px);
            display: flex;
            flex-direction: column;
            font-family: 'Roboto', sans-serif;
        }
        .box-content{
            width: 60%;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            height: calc(100vh - 57vw);
            display: flex;
            flex-direction: column;
            overflow: scroll;
        }
        .img-table{
            max-width: 100%;
            height: 100%;
            position: absolute;
            left: 50%;
            margin-top: -5px;
            transform: translate(-50%, 0);
            z-index: 2;
        }

        .logo-rank{
            width: 100%;
        }

        .one-name, .one-score, .two-name, .two-score, .three-name, .three-score{
            position: absolute;
            color: white;
            font-size: 24px;
            font-weight: bold;
            transform: translate(-50%, -50%);
            text-shadow: 0 0 4px white;
            word-wrap: break-word;
        }
        .one-pic, .two-pic, .three-pic{
            position: absolute;
        }
        .one-pic{
            top: 13%;
            left: 45.3%;
            background: white;
            border-radius: 50%; 
        }
        .two-pic{
            top: 36.5%;
            left: 25.9%;
            background: white;
            border-radius: 50% 50% 45% 45%;
            width: 12.8vw;
            height: 12vw;
            transform: rotate(-15deg);
        }
        .three-pic{
            top: 37%;
            right: 23.2%;
            background: white;
            border-radius: 50% 50% 45% 45%;
            width: 12.8vw;
            height: 12vw;
            transform: rotate(15deg);
        }
        .one-name{
            top: 41%;
            left: 51.5%;
            text-align: center;
            color: black;
            shadow: 0 0 0;
            font-weight: normal;
            font-size: 12px;
            width: 12%;
        }
        .one-score{
            top: 79%;
            left: 51.5%;
            text-align: center;
        }
        .two-name{
            top: 65%;
            left: 26%;
            color: black;
            text-align: center;
            transform: rotate(-12deg);
            shadow: 0 0 0;
            font-size: 10px;
            width: 15%;
        }
        .two-score{
            top: 85%;
            left: 31%;
            color: black;
            transform: rotate(-15deg);
            font-size: 18px;
        }
        .three-name{
            top: 65%;
            right: 23.5%;
            color: black;
            shadow: 0 0 0;
            transform: rotate(12deg);
            font-size: 10px;
            width: 15%;
            text-align: center;
        }
        .three-score{
            top: 87%;
            right: 27%;
            color: black;
            transform: rotate(15deg);
            font-size: 18px;
        }

        .table{
            display: flex;
            flex-direction: row;
            z-index: 50;
        }
        .table .title, .table .date, .table .score, .txtPoint, .imgP{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px 0;
            font-size: 20px;
            color: black;
            border-bottom: 1px solid black;
        }
        .table .title{
            font-size: 32px;
            font-weight: bold;
            flex: 1;
        }
        .table .imgP{
            flex: 1;
            display: flex;
            justify-content: flex-end;
        }
        .table .imgP .circle{
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 50%;
        }
        .table .date{
            flex: 3;
            text-align: center;
        }
        .table .score{
            flex: 1;
        }
        .table .txtPoint{
            flex: 1;
        }

        @media only screen and (max-width: 550px){
            .table .title, .table .date, .table .score, .txtPoint, .imgP{
                padding: 15px 0;
                font-size: 12px;
            }
            .table .title{
                font-size: 16px;
            }
            .table .imgP .circle{
                width: 30px;
                height: 30px;
            }
        }
        @media only screen and (max-width: 630px){
            .one-name{
                font-size: 7px;
                width: 12%;
                text-shadow: 0 0 0px black;
            }
            .one-score{
                top: 79%;
                left: 51.5%;
                text-align: center;
                font-size: 12px;
            }
            .two-name{
                font-size: 5px;
                width: 15%;
                text-shadow: 0 0 0px black;
            }
            .two-score{
                top: 85%;
                left: 31%;
                color: black;
                transform: rotate(-15deg);
                font-size: 9px;
            }
            .three-name{
                font-size: 5px;
                width: 15%;
                text-shadow: 0 0 0px black;
            }
            .three-score{
                top: 87%;
                right: 27%;
                color: black;
                transform: rotate(15deg);
                font-size: 9px;
            }
        }

        @media only screen and (min-width: 800px){
            .box-content{
                height: calc(100vh - 450px);
            }
            .one-pic{
                top: 11.5%;
                left: 45.3%;
                width: 12.5%;
                height: 28%;
            }
            .two-pic{
                top: 36.5%;
                left: 25.9%;
                border-radius: 50% 50% 45% 45%;
                width: 12.7%;
                height: 28.7%;
            }
            .three-pic{
                top: 37%;
                right: 23.2%;
                border-radius: 50% 50% 45% 45%;
                width: 12.7%;
                height: 28.7%;
            }
        }
      `}</style>
    </>
  )
}