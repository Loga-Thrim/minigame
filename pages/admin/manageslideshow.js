import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { userState } from '../../components/userState';
import LoginCheck from '../../components/loginCheck';
import Navbar from '../../components/adminNavbar';
import axios from 'axios';
import swal from 'sweetalert';
import { ImBin2 } from 'react-icons/im';

export default function Manageslideshow() { 
    const user = useRecoilValue(userState);
    const [imgs, setImgs] = useState(null);
    const [pImgs, setPImgs] = useState([]);
    const [opImgs, setOpimgs] = useState([]);

    useEffect(()=>{
        axios.get(`${process.env.URL_API}/img-slideshow`).then(res=>{
            setOpimgs(res.data.imgs.pic);
        })
    }, [])

    function submit(){
        const formData = new FormData();

        if(imgs){
            for(let i=0;i<imgs.length;++i){
                formData.append("img", imgs[i]);
                

                if(i == imgs.length - 1){
                    axios({
                        method: "POST",
                        url: `${process.env.URL_API}/img-slideshow`,
                        headers: {"Content-Type": "multipart/form-data"},
                        data: formData
                    }).then(res=>{
                        axios({
                            method: "PUT",
                            url: `${process.env.URL_API}/img-slideshow`,
                            headers: {"Content-Type": "application/json"},
                            data: JSON.stringify({
                                imgs: res.data.filesName.concat(opImgs)
                            })
                        })
                        swal({
                            icon: "success",
                            title: "เพิ่มรูปภาพ slideshow สำเร็จ!"
                        })
                    }).catch(e=>{
                        swal({
                            icon: "error",
                            title: "เกิดข้อผิดในการตั้งค่าข้อมูล ลองใหม่อีกครั้งภายหลัง"
                        })
                    })
                }
            }
        } else{
            axios({
                method: "PUT",
                url: `${process.env.URL_API}/img-slideshow`,
                headers: {"Content-Type": "application/json"},
                data: JSON.stringify({
                    imgs: opImgs
                })
            })
            swal({
                icon: "success",
                title: "เพิ่มรูปภาพ slideshow สำเร็จ!"
            })
        }
    }

    function choosePic(e){
        const files = e.target.files;
        setImgs(files);

        const pFiles = Array.from(e.target.files);
        Promise.all(pFiles.map(file => {
            return (new Promise((resolve,reject) => {
                const reader = new FileReader();
                reader.addEventListener('load', (ev) => {
                    resolve(ev.target.result);
                });
                reader.addEventListener('error', reject);
                reader.readAsDataURL(file);
            }));
        }))
        .then(images => {
            setPImgs(images);
        });
    }

    function deleteImg(uri){
        setOpimgs(opImgs.filter(e=>e!=uri))
    }

    return (
        <>
            <LoginCheck></LoginCheck>

            {user.name ? 
            <>
                <Navbar></Navbar>
                <div className="container">
                    <div className="contentBox">
                        <h1>จัดการ Slideshow</h1> <br /><br />
                        <h3>อัพโหลดรูปภาพ</h3> <br />
                        <label htmlFor="img" className="input">เลือกรูปภาพ</label>
                        <input type="file" multiple style={{display: 'none'}} id="img" 
                        onChange={choosePic} /> <br /><br /><br />
                        <div style={{display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap'}}>
                        { 
                            pImgs.map(imageURI => 
                                <div style={{flex: '1 0 20%', margin: 5}}>
                                    <div className="box-imgs">
                                        <img className="photo-uploaded" style={{maxWidth: '100%', maxHeight: 100}} src={imageURI} />
                                    </div>
                                </div>
                            )
                        }
                        { 
                            opImgs.map(uri => 
                                <div style={{flex: '1 0 20%', margin: 5, position: 'relative'}}>
                                    <div className="box-imgs">
                                        <img className="photo-uploaded" style={{maxWidth: '100%', maxHeight: 100}} 
                                        src={`${process.env.ENDPOINT}/${process.env.BUCKET_NAME}/${uri}`} /> 
                                        <button type="button" className="btnDelete" onClick={()=>deleteImg(uri)}>
                                        <ImBin2 size={15} /></button>
                                    </div>
                                    <br />
                                </div>
                            )
                        }
                        </div>
                        <br /><br /><br />
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
                .input{
                    cursor: pointer;
                    padding: 5px 20px;
                    border-radius: 5px;
                    background: rgb(50, 50, 200);
                    font-size: 16px;
                }
                .input:hover{
                    background: rgb(50, 50, 250);
                }
                .box-imgs{
                    position: relative;
                    width: 100%;
                    height: 100px;
                }
                .btnDelete{
                    font-size: 14px;
                    padding: 5px 0;
                    width: 30px;
                    background: rgb(200, 20, 20);
                    border-radius: 0px;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .btnDelete:hover{
                    background: rgb(200, 50, 50);
                }
                button{
                    color: white;
                    background: orange;
                    border: 0;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 50%;
                    font-size: 18px;
                    padding: 10px 0;
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
                    .input{
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
