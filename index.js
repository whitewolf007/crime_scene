var express = require('express')
var http = require('http')
var app = express()
var fs = require('fs')
var path = require('path')
var admin = require('firebase-admin')
// var formidable = require('formidable')

var serviceAccount = require('./serviceAccount.json')
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://crime-scene-bcbf1.firebaseio.com"
// })
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://crime-scene-6af89.firebaseio.com"
  });
var database = admin.database()
var currentuser

// app.engine('.html',require('ejs').__express)
// app.set('views', __dirname + '/views')
// app.set('view engine', 'html')
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json())


app.get('/index', function (req, res) {
    console.log('index fn called')
    var ret = fs.createReadStream(__dirname + '/views/index.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
    // res.sendFile(path.join(__dirname + '/views/index.html'))
})

app.get('/emergency', function (req, res) {
    var ret = fs.createReadStream(__dirname + '/views/emergency.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
    // res.sendFile(path.join(__dirname + '/views/emergency.html'))
})

app.get('/contact', function (req, res) {
    var ret = fs.createReadStream(__dirname + '/views/contact.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
})

app.get('/contact_user', function (req, res) {
    var ret = fs.createReadStream(__dirname + '/views/contact_user.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
})

app.get('/index_user', function (req, res) {
    var ret = fs.createReadStream(__dirname + '/views/index_user.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
})

app.get('/index_admin', function (req, res) {
    // var ret = fs.createReadStream(__dirname + '/views/index_admin.html', 'utf-8');
    var ret = fs.createReadStream(__dirname + '/views/index_admin.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
})


app.get('/emergency_admin', function (req, res) {
    var ret = fs.createReadStream(__dirname + '/views/emergency_admin.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
})

app.get('/emergency_user', function (req, res) {
    var ret = fs.createReadStream(__dirname + '/views/emergency_user.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
})

app.get('/upload_cases', function (req, res) {
    var ret = fs.createReadStream(__dirname + '/views/upload_cases.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
})

app.get('/fetchusertree',function(req,res){
    var db_path = '/users'
    database.ref(db_path).once('value').then(function(snap){
        var data = snap.val()
        res.send(data)
        console.log("USertree:"+data)
    })
})

app.get('/fetchcases', function (req, res) {
    var db_path = '/user_uploads'
    database.ref(db_path).once('value').then(function (snap) {
        var data = snap.val()
        if(data == null){
            res.send("no cases")
            return
        }
        var keys = Object.keys(data)
        var responsedata = new Object
        for (var i = 0; i < keys.length; i++) {
            // responsedata[i] = data[keys[i]]
            responsedata[keys[i]] = data[keys[i]]
        }
        console.log(responsedata)
        res.send(responsedata)
    })
})

app.get('/fetchcases_individual', function (req, res) {
    var db_path = '/cases_tree/'+currentuserid
    database.ref(db_path).once('value').then(function (snap) {
        var data = snap.val()
        var keys = Object.keys(data)
        var responsedata = new Object
        for (var i = 0; i < keys.length; i++) {
            responsedata[i] = data[keys[i]]
        }
        console.log(responsedata)
        res.send(responsedata)
    })
})

app.get('/fetchnotices',function(req,res){
    var db_path = '/notice'
    database.ref(db_path).once('value').then(function(snap){
        var data = snap.val()
        if(data == null)
        return
        var keys = Object.keys(data)
        var responsedata = new Object
        for (var i = 0; i < keys.length; i++) {
            responsedata[i] = data[keys[i]]
        }
        console.log(responsedata)
        res.send(responsedata)
    })
})

app.get('/fetchcurrentuser', function (req, res) {
    res.send(currentuser)
})

app.get('/fetchusers',function(req,res){
    var db_path = '/login'
    database.ref(db_path).once('value').then(function(snap){
        var data = snap.val()
        var datakeys = Object.keys(data)
        console.log(datakeys.length)
        res.send(data)
    })
})

app.get('/my_cases_user',function(req,res){
    var ret = fs.createReadStream(__dirname + '/views/my_cases_user.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
})

app.get('/info_zone',function(req,res){
    var ret = fs.createReadStream(__dirname + '/views/information_zone.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
})

app.get('/info_zone_user',function(req,res){
    var ret = fs.createReadStream(__dirname + '/views/information_zone_user.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' })
    ret.pipe(res);
})

app.post('/add_notice', function (req, res) {

    var up_data
    var notice_type = req.body.notice_type
    var person_name = req.body.person_name
    var file_name = req.body.file_name
    var date = new Date()
    var up_date = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()
    if (notice_type == 'missing') {
        var up_location = req.body.up_location
        up_data = { 'person_name': person_name, 'location': up_location, 'file_name': file_name, 'date': up_date, 'notice_type': notice_type }
    }
    else {
        var bounty = req.body.bounty
        up_data = { 'person_name': person_name, 'bounty': bounty, 'file_name': file_name, 'date': up_date, 'notice_type': notice_type }
    }

    var db_path = '/notice'
    database.ref(db_path).once('value').then(function (snap) {
        var data = snap.val()
        var count
        if (data == null)
            count = 1
        else {
            count = Object.keys(data).length
            count++
        }

        db_path = '/notice/' + count;
        database.ref(db_path).update(up_data).then(function (snap) {
            console.log('uploaded notice')
        })
    })

    res.send('uploaded notice')
})

app.post('/login_submit', function (req, res) {
    console.log(req.body)
    var username = req.body.username
    var password = req.body.password
    var db_path = "/login/" + username

    database.ref(db_path).once('value').then(function (snap) {
        var data = snap.val()
        if (data == null) {
            res.send("wrong userid")
            return
        }
        console.log(data)
        var role = data.role
        var pass = data.password
        console.log("Rec:" + password + ",DB:" + pass);
        if (pass != password) {
            res.send("wrong password")
            return
        }
        if (role == 'user') {
            currentuser = data.username
            currentuserid = username        //username = userid input by user
            console.log(currentuser)
            console.log(currentuserid)
            console.log("Sending back index_user")
            var ret = fs.createReadStream(__dirname + '/views/index_user.html', 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' })
            ret.pipe(res);
        }
        else if (role == 'admin') {
            console.log("Sending back dashboard_admin")
            var ret = fs.createReadStream(__dirname + '/views/admin_home.html', 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' })
            ret.pipe(res);
        }
        else {
            currentuser = data.username
            console.log("Sending back index_admin")
            var ret = fs.createReadStream(__dirname + '/views/index_admin.html', 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' })
            ret.pipe(res);
        }
    }).catch(function (error) {
        console.log(error)
    })

    // res.send(200, "text/plain", "success")
})

app.post('/registeruser', function (req, res) {
    console.log(req.body)
    var params = req.body
    var uname = req.body.username
    var pass = req.body.password
    var aadhar = req.body.aadhar
    var phone = req.body.phone
    var uid = req.body.userid

    var db_path = "/login/" + uid;
    database.ref(db_path).once('value').then(function (snap) {
        var db_data = snap.val()
        if (db_data != null) {
            res.send("userid exists")
            return;
        }
    })

    db_path = "/users/" + aadhar;
    var data = { "username": uname, "password": pass, "userid": uid, "phone": phone }

    database.ref(db_path).update(data).then(function (onUpdate) {
        // res.send("registration complete")
        updateTrees(params, res);
    }).catch(function (error) {
        res.send("registration failed")
    })
})

app.post('/upload', function (req, res) {
    console.log("received:" + req.body)
    var date = new Date()
    var up_date = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()
    if (req.body.registered_user) {
        db_path = "/login/" + req.body.userid
        var aadhar
        var username
        console.log(db_path)
        database.ref(db_path).once('value').then(function (snap) {
            var data = snap.val()
            console.log(data)
            aadhar = data.aadhar
            username = data.username
            console.log(aadhar)
        }, function (error) {
            console.log("Fetch error:" + error)
        })

        db_path = "/user_uploads/registered_user/"
        database.ref(db_path).once('value').then(function (snap) {
            var data = snap.val()
            var count
            if (data == null)
                count = 1
            else {
                count = Object.keys(data).length
                count++
            }
            // console.log(data_len)

            var up_data = { 'location': req.body.up_location, 'filename': req.body.filename, 'description': req.body.description, 'aadhar': aadhar, 'date': up_date, 'person_name': username, 'status': 'pending' }
            db_path = db_path + "case_" + count
            console.log(db_path)
            database.ref(db_path).update(up_data).then(function (snap) {
                console.log("Upload success")
            })

            //Seperate tree for individual users
            db_path = '/cases_tree/' + req.body.userid
            database.ref(db_path).once('value').then(function (snap) {
                var tree_key
                if (snap.val() == null) {
                    tree_key = 1
                }
                else {
                    tree_key = Object.keys(snap.val()).length
                    tree_key++
                    console.log(tree_key)
                }
                db_path = db_path+'/'+tree_key
                up_data = { 'location': req.body.up_location, 'filename': req.body.filename, 'description': req.body.description, 'aadhar': aadhar, 'date': up_date, 'person_name': username, 'status': 'pending','case_number':'case_'+count }
                console.log("Data to be uploaded:"+up_data)
                database.ref(db_path).update(up_data).then(function (onupdate) {
                    console.log('cases tree updated')
                })

            })

        })
    }
    else {
        var aadhar = req.body.aadhar
        var name = req.body.username
        var locn = req.body.up_location
        var desc = req.body.description
        var filename = req.body.filename
        var ph = req.body.phone

        console.log(aadhar + name + locn + desc + filename)

        db_path = "/user_uploads/emergency/"
        database.ref(db_path).once('value').then(function (snap) {
            var data = snap.val()
            // var data_len = Object.keys(data).length
            var count
            if (data == null)
                count = 1
            else {
                count = Object.keys(data).length
                count++
            }
            // data_len++
            // console.log(data_len)

            var up_data = { 'location': locn, 'filename': filename, 'description': desc, 'aadhar': aadhar, 'date': up_date, 'person_name': name, 'status': 'pending','phone':ph }
            db_path = db_path + "case_" + count
            console.log(db_path)
            database.ref(db_path).update(up_data).then(function (snap) {
                console.log("Upload success")
            })
        })
    }

    res.send("uploaded")
    // var file = req.files[0]
    // fstream = fs.createWriteStream('/static/images/' + 'myimage')
    // file.pipe(fstream)
    // fstream.on('close', function () {
    //     console.log('upload done')
    // })

    // var fstream;
    // if (req.busboy) {
    //     console.log("true")
    //     req.busboy.on('file', function (fieldname, file, filename) {
    //         fstream = fs.createWriteStream('/static/images/' + filename)
    //         file.pipe(fstream)
    //         fstream.on('close', function () {
    //             console.log('upload done')
    //         })
    //     })
    // }
})

app.post('/acceptcase',function(req,res){
    var params = req.body
    var db_path,db_path2
    if(params.registered == 0){
        db_path = '/user_uploads/emergency/'+params.case_number
        
    }
    else if(params.registered == 1){
        db_path = '/user_uploads/registered_user/'+params.case_number
        db_path2 = '/cases_tree'
        database.ref(db_path2).once('value').then(function(snap){
            var users = snap.val()
            var user_keys = Object.keys(users)
            for(var i = 0; i<user_keys.length; i++){
                console.log('User tree:'+user_keys[i])
                var cases = users[user_keys[i]]
                var cases_keys = Object.keys(cases)
                for(var j=0; j<cases_keys.length;j++){
                    console.log('Status:'+cases[cases_keys[j]].status)
                    if(cases[cases_keys[j]].case_number == params.case_number){
                        cases[cases_keys[j]].status = 'ongoing'

                        users[user_keys[i]][cases_keys[j]].status = 'ongoing'
                        database.ref(db_path2).update(users).then(function(onupdate){
                            console.log("FIELD CHANGED")
                        })
                    }
                }
            }

        })
    }
    var status = {'status':'ongoing'}
    database.ref(db_path).update(status).then(function(onupdate){
        res.send("updated status")
    })
})

app.post('/rejectcase',function(req,res){
    var params = req.body
    var db_path,db_path2
    if(params.registered == 0){
        db_path = '/user_uploads/emergency/'+params.case_number
        
    }
    else if(params.registered == 1){
        db_path = '/user_uploads/registered_user/'+params.case_number
        db_path2 = '/cases_tree'
        database.ref(db_path2).once('value').then(function(snap){
            var users = snap.val()
            var user_keys = Object.keys(users)
            for(var i = 0; i<user_keys.length; i++){
                console.log('User tree:'+user_keys[i])
                var cases = users[user_keys[i]]
                var cases_keys = Object.keys(cases)
                for(var j=0; j<cases_keys.length;j++){
                    console.log('Status:'+cases[cases_keys[j]].status)
                    if(cases[cases_keys[j]].case_number == params.case_number){
                        cases[cases_keys[j]].status = 'rejected'

                        users[user_keys[i]][cases_keys[j]].status = 'rejected'
                        database.ref(db_path2).update(users).then(function(onupdate){
                            console.log("FIELD CHANGED")
                        })
                    }
                }
            }

        })
    }
    var status = {'status':'rejected'}
    database.ref(db_path).update(status).then(function(onupdate){
        res.send("updated status")
    })
})

app.post('/closecase',function(req,res){
    var params = req.body
    var db_path,db_path2
    if(params.registered == 0){
        db_path = '/user_uploads/emergency/'+params.case_number
        
    }
    else if(params.registered == 1){
        db_path = '/user_uploads/registered_user/'+params.case_number
        db_path2 = '/cases_tree'
        database.ref(db_path2).once('value').then(function(snap){
            var users = snap.val()
            var user_keys = Object.keys(users)
            for(var i = 0; i<user_keys.length; i++){
                console.log('User tree:'+user_keys[i])
                var cases = users[user_keys[i]]
                var cases_keys = Object.keys(cases)
                for(var j=0; j<cases_keys.length;j++){
                    console.log('Status:'+cases[cases_keys[j]].status)
                    if(cases[cases_keys[j]].case_number == params.case_number){
                        cases[cases_keys[j]].status = 'closed'

                        users[user_keys[i]][cases_keys[j]].status = 'closed'
                        database.ref(db_path2).update(users).then(function(onupdate){
                            console.log("FIELD CHANGED")
                        })
                    }
                }
            }

        })
    }
    var status = {'status':'closed'}
    database.ref(db_path).update(status).then(function(onupdate){
        res.send("updated status")
    })
})

app.listen(8080);

function updateTrees(data, res) {
    var db_path = "/login/" + data.userid;
    console.log("Updating path:" + db_path);
    var newdata = { "password": data.password, "role": "user", 'aadhar': data.aadhar, 'username': data.username };
    database.ref(db_path).update(newdata).then(function (onUpdate) {
        console.log("updated trees")
        res.send("registration complete")
    }).catch(function (error) {
        console.log("update tree failed")
    })
}

// http.createServer(function (req, res) {
//     if (req.url.match("\.css$")) {
//         var cssPath = path.join(__dirname, 'public/css', req.url);
//         var fileStream = fs.createReadStream(cssPath, "UTF-8");
//         res.writeHead(200, { "Content-Type": "text/css" });
//         fileStream.pipe(res);
//     }

//     else if(req.url === '/index'){
//         fs.readFile('./views/index.html',"UTF-8",function(err,html){
//             res.writeHead(200,{'Content-Type':'text/html'})
//             res.end(html)
//         })
//     }

// }).listen(8080, function () {
//     console.log('Http created')
// })