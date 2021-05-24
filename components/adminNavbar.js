import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { userState } from '../components/userState';
import { useRecoilState } from 'recoil';

export default function adminNavbar() {
    const router = useRouter();
    const [user, setUser] = useRecoilState(userState);
    const [active, setActive] = useState({
        addmatch: false,
        resultmatch: false,
        managenavbar: false,
        manageslideshow: false,
        manageuser: false
    })
    const [menu, setMenu] = useState("none");

    useEffect(()=>{
        if(router.pathname == "/admin/addmatch"){
            setActive({addmatch: true})
        } else if(router.pathname == "/admin/resultmatch"){
            setActive({resultmatch: true})
        } else if(router.pathname == "/admin/managenavbar"){
            setActive({managenavbar: true})
        } else if(router.pathname == "/admin/manageslideshow"){
            setActive({manageslideshow: true})
        } else if(router.pathname == "/admin/manageuser"){
            setActive({manageuser: true})
        }
    }, [])

    function logout(){
        localStorage.removeItem("token");
        setUser({});
        router.push("/admin/login");
    }

    return (
        <div style={{width: '100%'}}>
            <ul>
                <li className="btnMenu">
                    <span onClick={()=>setMenu(menu==="none" ? "block" : "none")}>
                        <a>menu</a>
                    </span>
                </li>
                <li>
                    <Link href="/admin/addmatch">
                        <a className={active.addmatch ? "active" : null} >เพิ่มแมตซ์</a>
                    </Link>
                </li>
                <li>
                    <Link href="/admin/resultmatch">
                        <a className={active.resultmatch ? "active" : null }>จัดการผลการแข่งขัน</a>
                    </Link>
                </li>
                <li>
                    <Link href="/admin/managenavbar">
                        <a className={active.managenavbar ? "active" : null }>ตั้งค่าปุ่ม Navbar</a>
                    </Link>
                </li>
                <li>
                    <Link href="/admin/manageslideshow">
                        <a className={active.manageslideshow ? "active" : null }>จัดการ Slideshow</a>
                    </Link>
                </li>
                {
                    user.rights == "superadmin" ?
                    <li>
                        <Link href="/admin/manageuser">
                            <a className={active.manageuser ? "active": null}>จัดการผู้ใช้</a>
                        </Link>
                    </li> : null
                }
                <li>
                    <button type="button" onClick={logout}>ออกจากระบบ</button>
                </li>
            </ul>

            <style jsx>{`
                ul{
                    width: 20%;
                    min-height: 100vh;
                    position: fixed;
                    background: rgb(20, 20, 40);
                    margin: 0;
                    padding: 0;
                    text-align: center;
                }
                li{
                    list-style: none;
                }
                li.btnMenu { display: none }
                a, button{
                    display: block;
                    color: white;
                    font-size: 18px;
                    padding: 30px 0;
                    transition: .2s;
                    width: 100%;
                    cursor: pointer;
                    background: rgba(0,0,0,0);
                    border: 0;
                }
                a:hover, button:hover{
                    background: rgb(127, 127, 255);
                }
                .active{
                    background: rgb(127, 127, 255);
                }

                @media only screen and (max-width: 800px){
                    ul{
                        width: 100%;
                        min-height: auto;
                        position: fixed;
                        top: 0;
                        background: rgb(20, 20, 40);
                        margin: 0;
                        padding: 0;
                        z-index: 9999999;
                    }
                    li:not(li.btnMenu){
                        list-style: none;
                        display: ${menu};
                    }
                    li.btnMenu { 
                        list-style: none;
                        display: block;
                    }
                    a{
                        display: block;
                        color: white;
                        font-size: 16px;
                        padding: 10px 0;
                        transition: .2s;
                    }
                    a:hover{
                        background: rgb(127, 127, 255);
                    }
                    .active{
                        background: rgb(127, 127, 255);
                    }
                }
            `}</style>
        </div>
    )
}
