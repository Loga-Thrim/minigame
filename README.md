### server: Nodejs
### database: Mongodb
### start
    "node server/app.js"
### Environment variable
    - AWS_KEY_ID
    - AWS_SECRET_KEY 
    - ENDPOINT (endpoint storage images, exam: "https://sfo2.digitaloceanspaces.com" do not put '/' in the end of url)
    - BUCKET_NAME (bucket storage name)
    - URL_API (host name, exam: "https://minigame-demo.herokuapp.com" do not put '/' in the end of url)
    - MONGODB_URL (url for connect to Mongodb, exam: "mongodb://localhost:27017")
    - TITLE (is the title tag of head)
    - PORT (port for running app, default is 5000)
#### looking full example env in .env file
### Database 
    create database name "minigame"
    create collections 
        - user
        - match
        - navbar_custom
            - initial {name: "", url: ""}
        - slideshow
            - initial {pic: []}
