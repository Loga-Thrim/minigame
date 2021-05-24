import axios from 'axios';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { userState } from './userState';

export default function loginCheck() {
    const router = useRouter();
    const setUser = useSetRecoilState(userState);

    useEffect(()=>{
        axios.post(`${process.env.URL_API}/checklogin`, {
            token: localStorage.getItem("token")
        }, {
            "Content-Type": "application/json"
        }).then(res=>{
            try{
                const { name, phoneNumber, rights, score, pic } = res.data.payload;
                setUser({
                    name, phoneNumber, rights, score, pic
                });
                if(!phoneNumber){
                    if(router.pathname == "/admin/addmatch" || router.pathname == "/admin/resultmatch" || 
                    router.pathname == "/admin/manageuser" || router.pathname == "/admin/managenavbar" ||
                    router.pathname == "/admin/manageslideshow") router.push("/admin/login");
                    else if(router.pathname == "/history") router.push("/");
                }
            } catch(e){
                localStorage.removeItem("token");
                router.push("/login");
            }
        })
    }, [])
    return (
        <></>
    )
}
