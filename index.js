const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const slugify = require('slugify');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const Login = require("./database/Login");

//const Login = require("./database/loginController")

const connection = require('./database/connection');
connection.authenticate().then(() => {
    console.log("conneted with database!")
}).catch(err => {
    console.log(err)
});
const Games = require("./database/Games");

//CONFIG CORS
app.use(cors());

// CONFIG BODY-PARSER
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//END POINT GET
app.get("/games", (req, res) => {
    res.statusCode = 200 
    Games.findAll().then(all => {
        res.send(all)
    })
})
app.get("/game/:id", (req, res) => {
    if(isNaN(req.params.id)){
        res.statusCode = 400
    }else {
        let id = parseInt(req.params.id)
        let game = Games.findByPk(id).then(game => {
            if(game != undefined){
                res.statusCode = 200
                res.send(game)
            }else{
                res.sendStatus(404)
            }
            
        })
    }
})

//END POINT POST
app.post("/game", (req, res) => {
    const {name, price} = req.body;
    
    if((isNaN(price) && name == undefined) || name == ""){
        res.sendStatus(400)
    }else{
        Games.create({
            name: name,
            slug: slugify(name),
            price: price
        }).then(()=>{console.log("Okay!")}).catch(err=>{console.log(err)})
        res.sendStatus(200)
    }
})

//END POINT DELETE
app.delete("/game/:id", (req, res) => {
    const id = req.params.id;
    if(!isNaN(id)){
        Games.destroy({
            where: {
                id: id
            }
        }).then(()=>console.log("deleted")).catch(err=>console.log(err))
        res.sendStatus(200)
    }else{
        res.sendStatus(400)
    }
})

//END POINT PUT - UPDATE
app.put("/game/:id", (req, res) => {
    const id = req.params.id;
    const {name, price} = req.body;

    if(!isNaN(id)){

        if(name != undefined){
            if(name != ""){
                Games.update({
                    name: name,
                    slug: slugify(name)
                }, {
                    where: {id: id}
                }).then(() => {
                    console.log("updated")
                    res.sendStatus(200)
                }).catch(err => {
                    console.log(err)
                    res.sendStatus(400)
                })
            }           
        }else {
            res.sendStatus(400)
        }

        if(price != undefined){
            if(!isNaN(price)){
                Games.update({
                    price: price
                }, {
                    where: {id: id}
                }).then(() => {
                    console.log("updated")
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }else {
        res.sendStatus(400)
    }
   
})



app.post("/user/create", (req, res) => {
    const {email, password} = req.body;
    console.log(email, password)

    Login.findOne({where: {email: email}}).then(user => {
        if(user == undefined){
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            Login.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/games')
            }).catch(error => {
                res.redirect('/login.html')
                console.log(error)
            })
        }
    })
})

app.listen(8080, () => {
    console.log("API rodando !")
})