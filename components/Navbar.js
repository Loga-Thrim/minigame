import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { userState } from '../components/userState';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Navbar() {
    const user = useRecoilValue(userState);
    const router = useRouter();
    const [navbar, setNavbar] = useState({})

    useEffect(()=>{
        axios.get(`${process.env.URL_API}/navbar-custom`).then(res=>{
            setNavbar(res.data.navbar);
        })
    }, [])

    return (
        <div className="container">
            <Link href='/'>
                <a className="btnVote">VOTE</a>
            </Link>
            {   user.phoneNumber ?
                <Link href='/history'>
                    <a className="btnHistory">HISTORY</a>
                </Link>
                : router.pathname === "/login" ? 
                    <Link href='/register'>
                        <a className="btnHistory">REGISTER</a>
                    </Link> 
                : 
                <Link href='/login'>
                    <a className="btnHistory">LOGIN</a>
                </Link> 
            }
            <Link href='/ranking'>
                <a className="btnRanking">RANKING BOARD</a>
            </Link>
            <Link href={navbar ? navbar.url ? navbar.url : "#" : "#"}>
                <a className="btnCustom">{navbar ? navbar.name ? navbar.name : "Weekly prizes" : "Weekly prizes"}</a>
            </Link>

            <style jsx>{`
                .container{
                    width: 100%;
                    max-width: 800px;
                    height: 6vh;
                    position: fixed;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0px 0px 40px #cba334;
                    z-index: 9999;
                }
                .btnVote, .btnHistory, .btnRanking, .btnCustom{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 82%;
                    height: 100%;
                    font-weight: bold;
                }
                .btnVote{
                    background: linear-gradient(to right, #cca738, #f3ea6c);
                }
                .btnHistory{
                    background: linear-gradient(to right, #f3ea6c, #c3972b);
                    box-shadow: 0px 0px 2px rgba(0, 0, 0, .5);
                }
                .btnRanking{
                    width: 100%;
                    text-align: center;
                    background: linear-gradient(to right, #eee165, #c79e32);
                }
                .btnCustom{
                    width: 100%;
                    text-align: center;
                    background: linear-gradient(to right, #c79e32, #eee165);
                    box-shadow: 0px 0px 2px rgba(0, 0, 0, .5);
                }
            `}</style>
        </div>
    )
}
