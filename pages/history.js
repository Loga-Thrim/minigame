import { useEffect, useState } from 'react';
import axios from 'axios';
import LoginCheck from '../components/loginCheck';
import { userState } from '../components/userState';
import { useRecoilState } from 'recoil';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function History() {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [list, setList] = useState({
      match: [],
      team: [],
      ranking: 0
  });

  useEffect(()=>{
    if(user.phoneNumber){
        axios.get(`${process.env.URL_API}/gethistory/${user.phoneNumber}`).then(res=>{
            setList({match: res.data.match, team: res.data.list_team, ranking: res.data.ranking});
        }).catch(e=>{
            console.log(e);
        })
    }
  }, [user.phoneNumber])

  function logout(){
      localStorage.removeItem("token");
      setUser({});
      router.push("/");
  }

  return (
    <>
      <Layout bg="/images/bg_history.jpg">
        <LoginCheck />

        <div className="container">
            <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 20, 
            position: 'relative'}}>
                <div className="circle"></div>
            </div>
            <span style={{color: 'white', width: '100%', textAlign: 'center'}}>{user.name}</span>

            <div className="box-row">
                <div className="content">
                    <span>คะแนนของคุณ</span>
                    <span className="btn-result">{user.score}</span>
                </div>
                <div className="content">
                    <span>อันดับของคุณ</span>
                    <span className="btn-result">{list.ranking}</span>
                </div>
            </div> <br/>

            <div className="box-content">
                {
                    (list.match && list.team) ? list.match.map((item, index)=>
                        <div className="table" key={index}>
                            <span className="date">{item.date}</span>
                            <div className="title">
                                <div style={{flex: 2, display: 'flex', justifyContent: 'center'}}>
                                    { list.team[index] ?
                                        <img src={`${process.env.ENDPOINT}/${process.env.BUCKET_NAME}/${list.team[index].team1_img}`} alt="" /> 
                                    : null}
                                </div>
                                <span style={{color: 'white', flex: 1, display: 'flex', justifyContent: 'center'}}>vs</span>
                                <div style={{flex: 2, display: 'flex', justifyContent: 'center'}}>
                                    { list.team[index] ?
                                        <img src={`${process.env.ENDPOINT}/${process.env.BUCKET_NAME}/${list.team[index].team2_img}`} alt="" />
                                    : null}
                                </div>
                            </div>
                            <span className="date">{item.team_predict==1?"เจ้าบ้าน":
                            item.team_predict==2?"ทีมเยือน":"เสมอ"}</span>
                            <span className="score">{item.exited ? item.score : "-"}</span>
                        </div>
                    )
                : null}
                <br/>
            </div>

            <div className="logo">
                <img src="/images/bg_history_logo.png" alt="" style={{width: '100%'}} />
            </div>
        </div>
      </Layout>

      <style jsx>{`
        ::-webkit-scrollbar { display: none; }
        .circle{
            background: ${user.pic ? `url(${process.env.ENDPOINT + "/" + process.env.BUCKET_NAME + "/" + user.pic[0]})` : 'white' };
            background-size: cover;
            background-position: center;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container{
            position: relative;
            overflow: scroll;
            width: 100%;
            height: calc(100vh - 90px);
            display: flex;
            flex-direction: column;
            margin-top: 50px;
            z-index: 50;
        }
        .box-row{
            display: flex;
            flex-direction: row;
        }
        .box-row .content{
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .box-row .content span{
            color: white;
            font-size: 18px;
        }
        .box-row .content .btn-result{
            font-family: 'Open Sans', sans-serif;
            font-size: 20px;
            text-align: center;
            letter-spacing: 2px;
            font-weight: bold;
            background: linear-gradient(#ffffff, #d2d2d2);
            color: black;
            padding: 3px 0;
            width: 40%;
        }
        .box-content{
            width: 90%;
            position: relative;
            margin-left: auto;
            margin-right: auto;
            height: 39%;
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
        }
        .table{
            display: flex;
            flex-direction: row;
            background: rgba(0, 0, 0, .8);
        }
        .title, .table .date, .table .score{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 0;
            font-size: 16px;
            border: 1px solid;
            border-image-slice: 1;
            border-image-source: linear-gradient(to bottom, #fefa0b, #756311, #fefa0b);
        }
        .table .title{
            font-weight: bold;
            flex: 3;
            display: flex;
            flex-direction: row;
        }
        img{
            width: 30px;
        }
        .table .date{
            font-family: 'Open Sans', sans-serif;
            flex: 2;
            color: white;
        }
        .table .score{
            font-family: 'Open Sans', sans-serif;
            flex: 1;
            color: white;
        }
        .logo{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            bottom: 25px;
            position: absolute;
            z-index: -1;
        }

        @media only screen and (max-width: 500px){
            .box-row .content .btn-result{
                font-size: 14px;
                letter-spacing: 1px;
                padding: 1px 0;
            }
            .box-row .content span{
                color: white;
                font-size: 14px;
            }
            .title, .table .date, .table .score{
                padding: 7px 0;
                font-size: 14px;
            }
        }
        @media only screen and (max-height: 610px){
            .box-content{
                height: 32%;
            }
        }
      `}</style>
    </>
  )
}
