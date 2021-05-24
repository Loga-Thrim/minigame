require('dotenv').config()
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');
const mongoClient = require("mongodb").MongoClient;
const urlMongodb = process.env.MONGODB_URL || "mongodb://localhost:27017"
const path = require("path");

const jwt = require('jsonwebtoken');
const { ObjectId } = require("bson");
const privateKey = "dc7fea60godframedark8654";

const app = express();
const port = process.env.PORT || 5000

const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const appNext = next({ dev })
const handle = appNext.getRequestHandler() 

const UniqueStringGenerator = require('unique-string-generator');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const spacesEndpoint = new aws.Endpoint(process.env.ENDPOINT);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

mongoClient.connect(urlMongodb, { useUnifiedTopology: true }, (err, db)=>{
    if(err) throw err;
    const dbcon = db.db("minigame");

    app 
    .use(cors())
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(express.static('public'))

    .post("/img-register", (req, res)=>{
        let filesName = "";
        const upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: process.env.BUCKET_NAME,
                acl: 'public-read',
                key: function (request, file, cb) {
                    let fileType = file.originalname.split(".");
                    fileType = UniqueStringGenerator.UniqueString() + "." + fileType[fileType.length-1];

                    filesName = fileType;
                    cb(null, fileType);
                }
            })
        }).single('img');

        upload(req, res, err=>{
            if(err) throw err;
            res.json({status: "success", filesName})
        });
    })
    .post("/register", (req, res)=>{
        const {
            name, phoneNumber, password, img
        } = req.body;
        const saltRounds = 10;

        dbcon.collection("user").findOne({phoneNumber}, (err, usedPhoneNumber)=>{
            if(err) throw err;
            if(usedPhoneNumber){
                res.json({status: "failed"});
            } else{
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    if(err) throw err;
                    const dataInsert = {
                        name,
                        phoneNumber,
                        password: hash,
                        pic: img ? img : "",
                        rights: "user",
                        loged_in: 1,
                        score: 0,
                        game_predict: []
                    }
                    dbcon.collection("user").insertOne(dataInsert, (err, insertedRes)=>{
                        if(err) throw err;
                        const tokenPayload = {
                            name,
                            phoneNumber,
                            rights: "user",
                            loged_in: 1
                        }
                        jwt.sign({payload: tokenPayload}, privateKey, (err, token)=>{
                            if(err) throw err;
                            res.json({status: "success", token});
                        });
                    })
                })
            }
        })
    })
    .post("/login", (req, res)=>{
        const { phoneNumber, password } = req.body;
        dbcon.collection("user").findOne({phoneNumber}, (err, result)=>{
            if(err) throw err;
            try{
                bcrypt.compare(password, result.password, function(err, compareStatus) {
                    if(err) throw err;
                    if(compareStatus){
                        const tokenPayload = {
                            email: result.email,
                            name: result.name,
                            phoneNumber: result.phoneNumber,
                            pic: result.pic,
                            rights: result.rights,
                            score: result.score,
                            loged_in: 1
                        }

                        jwt.sign({payload: tokenPayload}, privateKey, (err, token)=>{
                            if(err) throw err;
                            res.json({status: "success", token});

                            dbcon.collection("user").updateOne({email: result.email}, {$set: {
                                loged_in: 1
                            }})
                        });
                    }
                    else res.json({status: "failed", token: ""});
                });
            } catch(e){
                res.json({status: "failed", token: ""});
            }
        })
    })
    .post("/login-admin", (req, res)=>{
        const { phoneNumber, password } = req.body;
        dbcon.collection("user").findOne({phoneNumber, rights: {$in: ["admin", "superadmin"]}}, (err, result)=>{
            if(err) throw err;
            try{
                bcrypt.compare(password, result.password, function(err, compareStatus) {
                    if(err) throw err;
                    if(compareStatus){
                        const tokenPayload = {
                            email: result.email,
                            name: result.name,
                            phoneNumber: result.phoneNumber,
                            rights: result.rights,
                            score: result.score,
                            loged_in: 1
                        }

                        jwt.sign({payload: tokenPayload}, privateKey, (err, token)=>{
                            if(err) throw err;
                            res.json({status: "success", token});

                            dbcon.collection("user").updateOne({email: result.email}, {$set: {
                                loged_in: 1
                            }})
                        });
                    }
                    else res.json({status: "failed", token: ""});
                });
            } catch(e){
                res.json({status: "failed", token: ""});
            }
        })
    })
    .post("/checklogin", (req, res)=>{
        const token = req.body.token;

        jwt.verify(token, privateKey, (err, decoded)=>{
            if(decoded){
                dbcon.collection("user").findOne({phoneNumber: decoded.payload.phoneNumber}, (err, user)=>{
                    if(err) throw err;
                    try{
                        res.json({status: "valid", payload: {
                            email: user.email,
                            name: user.name,
                            phoneNumber: user.phoneNumber,
                            pic: user.pic,
                            rights: user.rights,
                            score: user.score,
                            loged_in: user.loged_in
                        }})
                    } catch(e){
                        res.json({status: "invalid", payload: {}});
                    }
                })
            }
            else res.json({status: "invalid", payload: {}})
        })
    })
    .post("/imgupload", (req, res)=>{
        let filesName = [];
        const upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: process.env.BUCKET_NAME,
                acl: 'public-read',
                key: function (request, file, cb) {
                    let fileType = file.originalname.split(".");
                    fileType = UniqueStringGenerator.UniqueString() + "." + fileType[fileType.length-1];

                    filesName.push(fileType)
                    cb(null, fileType);
                }
            })
        }).array('img', 2);

        upload(req, res, err=>{
            if(err) throw err;
            res.json({status: "success", filesName})
        });
    })
    .post("/addmatch", (req, res)=>{
        const { team1_name, team2_name, team1_score, team2_score, draw_score, time, date, img1, img2 } = req.body;
        const dataInsert = {
            team1: {
                name: team1_name,
                score: team1_score,
                img: img1
            },
            team2: {
                name: team2_name,
                score: team2_score,
                img: img2
            },
            draw_score,
            time,
            date,
            team_win: 0
        }
        dbcon.collection("match").insertOne(dataInsert, (err, doc)=>{
            if(err) throw err;
            res.json({status: "success"});
        })
    })
    .post("/predict", (req, res)=>{
        const { id, phoneNumber, team, time, date } = req.body;

        dbcon.collection("user").updateOne({phoneNumber}, {
            $push: {
                game_predict: {
                    id_match: id,
                    team_predict: team,
                    time,
                    date,
                    score: 0,
                    exited: 0,
                }
            }
        }, (err, doc)=>{
            if(err) throw err;
            res.json({status: "success"});
        })
    })
    .get("/getmatch/:phoneNumber", (req, res)=>{
        const { phoneNumber } = req.params;
        dbcon.collection("match").find({}).toArray((err, resultMatch)=>{
            if(err) throw err;
            dbcon.collection("user").findOne({phoneNumber}, {projection: {
                _id: 0, email: 0, name: 0, phoneNumber: 0, password: 0, rights: 0, loged_in: 0, score: 0
            }}, (err, resultUser)=>{
                if(err) throw err;
                const date = new Date();
                const fMount = date.getMonth() < 10 ? "0" + (date.getMonth()+1) : date.getMonth();
                const fDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                const current_date = date.getFullYear() + "-" + fMount + "-" + fDate;
                
                const fHours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                const fMinutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                const current_time = fHours + ":" + fMinutes;

                resultMatch = resultMatch.filter(e=>e.date >= current_date);
                resultMatch = resultMatch.filter(e=>e.date == current_date ? e.time >= current_time : true);
                function difDate(eDate){
                    eDate = eDate.split("-");
                    const p_current = current_date.split("-");
                    const dif = (eDate[0]*365 + eDate[1]*30 + eDate[2]) - (p_current[0]*365 + p_current[1]*30 + p_current[2]);

                    if(dif<=1) return 1;
                    else return 0;
                }
                resultMatch = resultMatch.filter(e=>difDate(e.date))
                resultMatch = resultMatch.filter(e=>e.team_win == 0);
                resultMatch.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))
                resultMatch.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
                if(resultUser.game_predict == 0){
                    res.json({match: resultMatch});
                } else{
                    resultUser.game_predict.forEach((obj, index)=>{
                        resultMatch = resultMatch.filter(e => e._id!=obj.id_match);
                        if(index == resultUser.game_predict.length - 1) res.json({match: resultMatch});
                    })
                }
            })
        })
    })
    .get("/gethistory/:phoneNumber", (req, res)=>{
        const { phoneNumber } = req.params;
        if(phoneNumber){
            dbcon.collection("user").findOne({phoneNumber}, {projection: {
                _id: 0, email: 0, name: 0, phoneNumber: 0, password: 0, rights: 0, loged_in: 0, score: 0
            }}, (err, result)=>{
                if(err) throw err;
                dbcon.collection("user").find({}, {projection: {
                    _id: 0, email: 0, name: 0, password: 0, rights: 0, loged_in: 0, game_predict: 0
                }}).toArray((err, allUser)=>{
                    if(err) throw err;
                    allUser.sort((a,b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));
                    const ranking = allUser.map(e=>e.phoneNumber).indexOf(phoneNumber) + 1;
                    let list_team = [];
    
                    if(result.game_predict.length == 0) res.json({match: [], ranking, list_team: []});
                    result.game_predict.forEach((item, index)=>{
                        dbcon.collection("match").findOne({_id: ObjectId(item.id_match)}, (err, aTeam)=>{
                            if(err) throw err;
                            try{
                                list_team.push({
                                    team1_img: aTeam.team1.img,
                                    team2_img: aTeam.team2.img
                                })
                            } catch(e){
                                list_team.push
                            }
                            if(index == result.game_predict.length - 1){
                                list_team.reverse();
                                result.game_predict.reverse();
                                res.json({match: result.game_predict, ranking, list_team});
                            }
                        })
                    })
                })
            })
        }
        
    })
    .get("/get-score-rank/:phoneNumber", (req, res)=>{
        const { phoneNumber } = req.params;
        dbcon.collection("user").findOne({phoneNumber}, {projection: {
            _id: 0, email: 0, name: 0, phoneNumber: 0, password: 0, rights: 0, loged_in: 0
        }}, (err, result)=>{
            if(err) throw err;
            dbcon.collection("user").find({}, {projection: {
                _id: 0, email: 0, name: 0, password: 0, rights: 0, loged_in: 0, game_predict: 0
            }}).toArray((err, allUser)=>{
                if(err) throw err;
                allUser.sort((a,b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));
                const ranking = allUser.map(e=>e.phoneNumber).indexOf(phoneNumber) + 1;
                res.json({score: result.score, ranking});
            })
        })
    })
    .get("/getmatch-all", (req, res)=>{
        dbcon.collection("match").find({}).toArray((err, result)=>{
            if(err) throw err;
            const date = new Date();
            const fMount = date.getMonth() < 10 ? "0" + (date.getMonth()+1) : date.getMonth();
            const fDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            const current_date = date.getFullYear() + "-" + fMount + "-" + fDate;
            
            const fHours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            const fMinutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            const current_time = fHours + ":" + fMinutes;

            result = result.filter(e=>e.date >= current_date);
            result = result.filter(e=>e.date == current_date ? e.time >= current_time : true);

            function difDate(eDate){
                eDate = eDate.split("-");
                const p_current = current_date.split("-");
                const dif = (eDate[0]*365 + eDate[1]*30 + eDate[2]) - (p_current[0]*365 + p_current[1]*30 + p_current[2]);

                if(dif<=1) return 1;
                else return 0;
            }
            result = result.filter(e=>difDate(e.date))
            result = result.filter(e=>e.team_win == 0);
            result.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))
            result.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
            res.json({matchs: result});
        })
    })
    .get("/getmatch-all-admin", (req, res)=>{
        dbcon.collection("match").find({}).toArray((err, result)=>{
            if(err) throw err;
            result.sort((a,b) => (a.team_win == 0) ? -1 : ((b.team_win == 0) ? 1 : 0))
            result.sort((a,b) => (a.time > b.time && b.team_win == 0) ? 1 : ((b.time > a.time && a.team_win == 0) ? -1 : 0))
            result.sort((a,b) => (a.date > b.date && b.team_win == 0) ? 1 : ((b.date > a.date && a.team_win == 0) ? -1 : 0))
            res.json({matchs: result});
        })
    })
    .get("/user-rank", (req, res)=>{
        dbcon.collection("user").find({}, {projection: {
            _id: 0, email: 0, password: 0, rights: 0, loged_in: 0, game_predict: 0
        }}).toArray((err, allUser)=>{
            allUser.sort((a,b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));
            res.json({userSorted: allUser});
        })
    })
    .post("/resultmatch", (req, res)=>{
        const { id, team } = req.body;
        dbcon.collection("user").find({game_predict: {$elemMatch: {id_match: id}}}, {
            projection: {
                email: 0, password: 0, rights: 0, loged_in: 0, name: 0, phoneNumber: 0
            }
        })
        .toArray((err, resultUser)=>{
            if(err) throw err;

            dbcon.collection("match").findOne({_id: ObjectId(id)}, (err, resultMatch)=>{
                if(err) throw err;
                dbcon.collection("match").updateOne({_id: ObjectId(id)}, {$set: {team_win: team}}, (err, doc)=>{
                    if(err) throw err;

                    resultUser.forEach((item, index)=>{
                        let p_score = 0;
                        p_score = team==1?resultMatch.team1.score:team==2?resultMatch.team2.score:team==3?
                        resultMatch.draw_score:0;

                        item.game_predict = item.game_predict.filter(e=>e.id_match == id);

                        if(item.game_predict[0].team_predict == team){
                            console.log("Here");
                            dbcon.collection("user").updateOne({_id: item._id, game_predict: {$elemMatch: {id_match: id}}},{
                                $set: {
                                    score: parseInt(item.score) + parseInt(p_score),
                                    "game_predict.$.score": parseInt(p_score),
                                    "game_predict.$.exited": 1
                                }
                            })
                        } else{
                            dbcon.collection("user").updateOne({_id: item._id, game_predict: {$elemMatch: {id_match: id}}},{
                                $set: {
                                    "game_predict.$.exited": 1
                                }
                            })
                        }
                        if(index == resultUser.length-1) res.json({status: "success"})
                    })
                })
            })
        })
    })
    .delete("/deletematch/:id", (req, res)=>{
        const { id } = req.params;
        dbcon.collection("match").deleteOne({_id: ObjectId(id)}, (err, doc)=>{
            if(err) throw err;
            dbcon.collection("user").updateMany({game_predict: {$elemMatch: {id_match: id}}}, {
                $pull: { game_predict: { id_match: id } }
            }, (err, doc)=>{
                if(err) throw err;
                res.json({status: "success"});
            })
        })
    })
    .delete("/delete-user/:id", (req, res)=>{
        const { id } = req.params;
        dbcon.collection("user").deleteOne({_id: ObjectId(id)}, (err, doc)=>{
            if(err) throw err;
            res.json({status: "success"});
        })
    })
    .get("/getuser-all", (req, res)=>{
        dbcon.collection("user").find({}, {
            projection: {
                password: 0, loged_in: 0, game_predict: 0
            }
        }).toArray((err, result)=>{
            if(err) throw err;
            res.json({users: result});
        })
    })
    .put("/user-edit-rights", (req, res)=>{
        const {id, rights} = req.body;
        const e_rights = rights==1?"user":rights==2?"admin":"user";

        dbcon.collection("user").updateOne({_id: ObjectId(id)}, {$set: {rights: e_rights}}, (err, doc)=>{
            if(err) throw err;
            res.json({status: "success"});
        })
    })
    .get("/navbar-custom", (req, res)=>{
        dbcon.collection("navbar_custom").findOne({}, (err, result)=>{
            if(err) throw err;
            res.json({navbar: result});
        })
    })
    .put("/navbar-custom", (req, res)=>{
        const { _id, name, url } = req.body;

        dbcon.collection("navbar_custom").update({_id: ObjectId(_id)}, {$set: {name, url}}, (err, docs)=>{
            if(err) throw err;
            res.json({status: "success"});
        })
    })
    .post("/img-slideshow", (req, res)=>{
        let filesName = [];
        const upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: process.env.BUCKET_NAME,
                acl: 'public-read',
                key: function (request, file, cb) {
                    let fileType = file.originalname.split(".");
                    fileType = UniqueStringGenerator.UniqueString() + "." + fileType[fileType.length-1];

                    filesName.push(fileType)
                    cb(null, fileType);
                }
            })
        }).array('img', 20);

        upload(req, res, err=>{
            if(err) throw err;
            res.json({status: "success", filesName});
        });
    })
    .get("/img-slideshow", (req, res)=>{
        dbcon.collection("slideshow").findOne({}, (err, imgs)=>{
            res.json({imgs});
        })
    })
    .put("/img-slideshow", (req, res)=>{
        const { imgs } = req.body;
        console.log(imgs)
        dbcon.collection("slideshow").update({}, {$set: {pic: imgs}}, (err, doc)=>{
            if(err) throw err;
            res.json({status: "success"});
        })
    })
    //.listen(port, ()=>console.log(`> App on port ${port}`));
    appNext.prepare().then(() => {
        app.get("*", (req, res) => {        
            return handle(req, res);
        })
        app.listen(port, ()=>console.log(`> App on port ${port}`));
    })
})