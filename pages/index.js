import { useEffect, useState } from 'react';
import axios from 'axios';
import LoginCheck from '../components/loginCheck';
import { userState } from '../components/userState';
import SelectVote from '../components/SelectVote';
import { atom, useRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

import Layout from '../components/Layout';

const popupVoteState = atom({
  key: "popupVote",
  default: 'none'
})

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [listMatch, setListMatch] = useState([]);

  const [display, setDisplay] = useRecoilState(popupVoteState);
  const [dataMatch, setDataMatch] = useState({
    id: "",
    date: "",
    time: ""
  });
  const [score, setScore] = useState(null);
  const [rank, setRank] = useState(null);
  const [slideshow, setSlideshow] = useState([]);

  function getMatch(){
    if(user.phoneNumber){
      axios.get(`${process.env.URL_API}/getmatch/${user.phoneNumber}`)
      .then(result=>{
        setListMatch(result.data.match);
      })
      .catch(e=>{
        console.log(e)
      })
    } else{
      axios.get(`${process.env.URL_API}/getmatch-all`)
      .then(result=>{
        setListMatch(result.data.matchs);
      })
      .catch(e=>{
        console.log(e);
      })
    }
  }

  useEffect(()=>{
    if(user.phoneNumber) getMatch();
  }, [display])

  useEffect(()=>{
    getMatch();

    if(user.phoneNumber){
      axios.get(`${process.env.URL_API}/get-score-rank/${user.phoneNumber}`).then(res=>{
          setScore(res.data.score);
          setRank(res.data.ranking);
      }).catch(e=>{
          console.log(e);
      })
    }
  }, [user.phoneNumber])

  useEffect(()=>{
    if(!user.phoneNumber){
      setScore(null);
      setRank(null);
    }
  }, [user])

  useEffect(()=>{
    axios.get(`${process.env.URL_API}/img-slideshow`).then(res=>{
      setSlideshow(res.data.imgs.pic);
    }).catch(e=>console.log(e));
  }, [])

  return (
    <>
      <Layout bg="/images/bg_vote.jpg">
        <LoginCheck />
        
        <SelectVote dataMatch={dataMatch} phoneNumber={user.phoneNumber}></SelectVote>

        <div className="contentBox">
          { user.name ?
          <div className="header-title">
            <img src="/images/logo_vote_titlebar.png" alt="" className="img-titlebar" />
            <div className="box-txt-title">
              <div className="txt-title">Your Score 
              <span className="title-point">{score!=null ? score : "-"}</span></div>
              <div className="txt-title">Your Ranking
              <span className="title-point">{rank ? rank : "-"}</span></div>  
            </div> <br /><br />
          </div>
          :
          <div className="box-slideshow">
            <AliceCarousel autoPlay autoPlayInterval="3000" disableButtonsControls disableDotsControls
            disableAutoPlayOnAction={false} infinite>
              {
                slideshow ? slideshow.map((item, index)=>
                  <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <img src={process.env.ENDPOINT + '/' + process.env.BUCKET_NAME + '/' + item
                    } className="sliderimg" className="img-slideshow" />
                  </div>
              ) : null}
            </AliceCarousel>
          </div> 
          }
          <br />

          <div className="container-content">
            <img src="images/table_vote.png" className="img-table-vote" alt="" />
            <div className="content-table">
              <br />  
              {
                listMatch.map((item, index)=>
                <div key={index} style={{lineHeight: '10px'}}>
                  <div className="box">
                    <img src={`${process.env.ENDPOINT}/${process.env.BUCKET_NAME}/${item.team1.img}`} className="imgLogo" alt=""/>
                    <span className="txtVs">VS</span>
                    <img src={`${process.env.ENDPOINT}/${process.env.BUCKET_NAME}/${item.team2.img}`} className="imgLogo" alt=""/>
                    {
                      user.phoneNumber ? 
                      <button className="btnVote" onClick={()=>{
                        setDisplay("flex");
                        setDataMatch({id: item._id, time: item.time, date: item.date, s_team1: item.team1.score,
                        s_team2: item.team2.score, s_draw: item.draw_score});
                      }}>VOTE</button> :
                      <button className="btnVote" onClick={()=>router.push("/login")}>VOTE</button>
                    }
                  </div>
                </div>
              )} 
            </div>
          </div>
          
          <div className="logo">
            <img src="/images/logo_vote.png" alt="" style={{maxWidth: '100%'}} />
          </div> <br /><br />
        </div> 
        
      </Layout>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;900&display=swap');
        *{
          font-family: 'Roboto', sans-serif;
          padding: 0;
        }
        .header-title{
          position: relative;
          display: flex;
          flex-direction: row;
          width: 100%;
          justify-content: center;
          align-items: center;
          margin-left: auto;
          margin-right: auto;
        }
        .img-titlebar{
          position: absolute;
          width: 110%;
          z-index: 2;
        }
        .box-txt-title{
          width: 65%;
          display: flex;
          flex-direction: row;
          z-index: 50;
        }
        .txt-title{
          flex: 1;
          color: black;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .title-point{
          margin-left: 10px;
          border: 1px solid black;
          padding: 3px 7px;
        }
        .box-slideshow{
          width: 100%;
          z-index: 53;
        }
        .img-slideshow{
          width: 100%;
          max-height: 230px;
        }
        ::-webkit-scrollbar { display: none; }
        .contentBox{
          position: relative;
          overflow: scroll;
          width: 100%;
          padding: 0;
          padding-top: 90px;
          height: 94vh;
          display: flex;
          flex-direction: column;
          z-index: 50;
          overflow: hidden;
        }
        .logo{
          width: 100%;
          display: flex;
          text-align: center;
          bottom: 70px;
          position: fixed;
          z-index: -1;
        }

        .container-content{
          width: 100%;
        }
        .content-table{
          position: relative;
          width: 100%;
          height: 50vw;
          padding: 0 11%;
          margin-left: auto;
          margin-right: auto;
          overflow: scroll;
          z-index: 5;
        }
        .img-table-vote{
          width: 110%;
          left: 50%;
          transform: translate(-50%, 0);
          margin-left: 3px;
          position: absolute;
          height: 40%;
          z-index: 2;
        }
        .box{
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;  
          justify-content: space-between;
          padding: 5px 10%;
          z-index: 10;
        }
        .txtVs{
          color: black;
          font-size: 48px;
          font-weight: bold;
        }
        .imgLogo:nth-child(1){
          margin-left: 20px;
        }
        .imgLogo{
          width: 15%;
        }
        .btnVote{
          cursor: pointer;
          background: black;
          padding: 15px 7%;
          color: white;
          font-size: 20px;
          font-weight: bold;
          border: 0;
          border-radius: 10px;
          outline: none;
        }

        @media only screen and (max-width: 500px){
          .contentBox{
            line-height: 10px;
          }
          .txt-title{
            font-size: 12px;
            font-weight: normal;
          }
          .logo{
            bottom: 55px;
          }
          .title-point{
            margin-left: 5px;
            padding: 0px 5px;
          }
          .content-table{
            height: 43vh;
          }
          .img-table-vote{
            height: 45vh;
            margin-left: 1px;
          }
          .box{
            padding: 5px 10px;
          }
          .txtVs{
            font-size: 28px;
          }
          .btnVote{
            padding: 10px 5%;
            font-size: 16px;
            margin-right: 10px;
          }
          .img-slideshow{
            max-height: 120px;
          }
        }
        @media only screen and (max-height: 740px) and (max-width: 800px){
          .img-table-vote{
            height: 72vw;
            margin-left: 1px;
          }
          .content-table{
            height: 70vw;
          }
        }

        @media only screen and (min-width: 800px){
          .content-table{
            height: 36vh;
          }
          .logo{
            left: 50%;
            margin-left: -400px;
          }
        }
      `}</style>
    </>
  )
}
