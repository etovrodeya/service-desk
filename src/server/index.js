const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const crypto = require('crypto');// модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
const UserModel = require('./models.js').UserModel;
const TicetModel = require('./models.js').TicetModel;
const RefreshTokenModel = require('./models.js').RefreshTokenModel;
const CommentModel = require('./models.js').CommentModel;
const router = express.Router();
var cors = require('cors')

const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const jwtsecret = "mysecretkey"; // ключ для подписи JWT

const root = './';
const app = express();
mongoose.Promise = Promise;
mongoose.get('debug',true);

app.use(cors());

app.use(passport.initialize()); // сначала passport
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(root)));

//пароль - имейл авторизация

passport.use(new LocalStrategy ({
    usernameField: 'email',
    passportField: 'password',
    session: false
    },
    function (email, password, done) {
        UserModel.findOne({email: email, isDeleted: false}, (err, user) => {           
            if (err) {
                return done(err);
            }
            if (!user || !user.checkPassword(password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

//jwt авторизация

var jwtOptions = {
    jwtFromRequest :ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: jwtsecret,
    passReqToCallback: true
};

passport.use(new JwtStrategy(jwtOptions, function (req, payload, done){
    console.log('AccessToken верифицирован');
    if(Math.round(Math.floor(Date.now()/1000)-payload.iat)>36){
        console.log('срок действия AccessToken закончился');
        if (!req.headers.refreshtoken) {
            console.log('req.RefreshToken отсутствует'); 
            return done(null, false);
        }
        RefreshTokenModel.findOne({userId: payload.id}, (err, refreshToken) => {
            console.log('Поиск RefreshToken');
            if (err){
                console.log('Поиск RefreshToken закончился ошибкой');
                return done (err)
            }
            console.log(refreshToken.token);
            console.log(req.headers.refreshtoken);
            if (refreshToken.token === req.headers.refreshtoken){
                console.log('RefreshToken найден и он равен req.RefreshToken');
                jwt.verify(refreshToken.token,jwtsecret, function(err, decoded) {
                    console.log('RefreshToken верифицирован');
                    if(Math.round(Math.floor(Date.now()/1000)-decoded.iat)>36000){
                        console.log('срок действия RefreshToken закончился');
                        return done(null, false)
                    } else {
                        console.log('RefreshToken верифицирован. Поиск User');
                        UserModel.findById(payload.id,
                            'UserName userId phone office status createdAt email',
                            (err, user) => {
                            if (err) {
                                console.log('Поиск User закончился ошибкой');
                                return done(err)
                            }
                            if (user) {
                                console.log('User найден. Передача его модели и нового accessToken в req');
                                var payloadAccess = {
                                    id: user.id,
                                    UserName: user.UserName,
                                    status: user.status,
                                    iat: Math.floor(Date.now()/1000)
                                }; 
                                console.log('создание AccessToken');
                                var accessToken = jwt.sign(payloadAccess, jwtsecret);
                                req.Authorization = "JWT " + accessToken;
                                done(null, user);
                            } else {
                                console.log('User не найден');
                                done(null, false);
                            }
                        }); 
                    }
                });
            } else {
                console.log('RefreshToken пустой или не равен req.headers.refreshtoken');
                done(null, false);
            }
        });
    } else {
        console.log('AccessToken верифицирован. Поиск User');
        UserModel.findById(payload.id,
            'UserName userId phone office status createdAt email',
            (err, user) => {
            if (err) {
                console.log('Поиск User закончился ошибкой');
                return done(err)
            }
            if (user) {
                console.log('User найден. Передача его модели и нового accessToken в req');
                done(null, user);
            } else {
                console.log('User не найден');
                done(null, false);
            }
        });    
    }
}));

//страница проверки работоспособности сервера

app.get('/api', function (req, res){
    res.send('API is running');
});

//создание тикета

app.post('/api/ticets/create',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    var ticet = new TicetModel ({
        description: req.body.description,
        ticetId: '',
        userName: req.user.UserName,
        userId: req.user.userId
    });
    var result = {
        status: "",
        message: ""
    }
    TicetModel.count().exec(function(err, count){
        if (err){
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        }
        ticet.ticetId = Math.ceil(count + 1);
        ticet.save(function(err) {
            if(err){
                result.status = "error";
                result.message = err;
                return res.send({result: result});
            } else {
                result.status = "OK";
                result.message = "Тикет создан";
                return res.send({result: result});
            }
        });
    })
});

//получить запись тикета

app.get('/api/ticets/get',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    var result = {
        status: "",
        message: "",
        ticet: ""
    }
    return TicetModel.findOne({ticetId: req.query.id}, function (err, ticet){
        if (err){
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        } else {
            result.ticet = ticet
            return res.send({result: result});
        }
    });
});

// получить запись юзера

app.get('/api/users/get',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    if (req.user.status != 'Администратор'){
        result.status = "error";
        result.message = 'Недостатоно прав для совершения действия'
        return res.send({result: result});
    }
    var result = {
        status: "",
        message: "",
        user: ""
    }
    return UserModel.findOne({userId: req.query.id},
        'UserName userId phone office status createdAt email',
         function (err, user){
        if (err){
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        }
        if (user){
            result.user = user
            return res.send({result: result});
        }
    });
});

// получить профиль авторизованного пользователя

app.get('/api/users/getMyProfile',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    var result = {
        status: "",
        message: "",
        user: ""
    }
    result.user = req.user
    return res.send({result: result});
});

//обновление записи тикета

app.put('/api/ticets/edit',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    if (req.user.status != 'Администратор'){
        result.status = "error";
        result.message = 'Недостатоно прав для совершения действия'
        return res.send({result: result});
    }
    var result = {
        status: "",
        message: "",
        ticet: ""
    }
    return TicetModel.findOne({ticetId: req.body.ticetId}, function (err, ticet){
        if(err) {
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        }
        ticet.title = req.body.title;
        ticet.author = req.body.author;
        ticet.description = req.body.description;
        ticet.status = req.body.status;        
        ticet.curator = req.body.curator;
        ticet.curatorId = req.body.curatorId;
        return ticet.save(function (err) {
            if (err) {
                result.status = "error";
                result.message = err;
                return res.send({result: result});
            } else {
                result.status = "OK";
                result.message = "Заявка обновлена";
                result.ticet = ticet
                return res.send({result: result});
            }
        });
    });
});

//обновление профиля

app.put('/api/users/edit',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    if (req.user.status != 'Администратор'){
        result.status = "error";
        result.message = 'Недостатоно прав для совершения действия'
        return res.send({result: result});
    }
    var result = {
        status: "",
        message: "",
        user: ""
    }
    return UserModel.findOne({userId: req.body.userId},
        'UserName userId phone office status createdAt email',
        function (err, user){
        if(err) {
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        }
        user.UserName = req.body.UserName;
        user.phone = req.body.phone;
        user.office = req.body.office;
        user.status = req.body.status;        
        return user.save(function (err) {
            if (err) {
                result.status = "error";
                result.message = err;
                return res.send({result: result});
            } else {
                result.status = "OK";
                result.message = "Профиль обновлен";
                result.user = user
                return res.send({result: result});
            }
        });
    });
});

//получение списка тикетов

app.get('/api/ticets/list',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    if (req.user.status != 'Администратор'){
        result.status = "error";
        result.message = 'Недостатоно прав для совершения действия'
        return res.send({result: result});
    }
    var result = {
        status: "",
        message: "",
        ticketsList: "",
    };
    TicetModel.find({isDeleted: false},function(err, ticetsList){
        if (err){
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        } 
        if(ticetsList.length == 0){
            result.status = "error";
            result.message = "Тикеты не найдены";
            return res.send({result: result});
        } else {
            result.status = "OK";
            result.ticketsList = ticetsList;
            return res.send({result: result});
        }
    })
});

//получение моего списка тикетов

app.get('/api/ticets/myList', passport.authenticate('jwt', { session: false}), function(req, res){
    var result = {
        status: "",
        message: "",
        ticketsList: "",
    };
    TicetModel.find({userId: req.user.userId,
        isDeleted: false},function(err, ticetsList){
        if (err){
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        } 
        if(ticetsList.length == 0){
            result.status = "error";
            result.message = "Записи не найдены";
            return res.send({result: result});
        } else {
            result.status = "OK";
            result.ticketsList = ticetsList;
            return res.send({result: result});
        }
    })
});

//получение моего курируемого списка тикетов

app.get('/api/ticets/mySupervisedList',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    if (req.user.status != 'Администратор'){
        result.status = "error";
        result.message = 'Недостатоно прав для совершения действия'
        return res.send({result: result});
    }
    var result = {
        status: "",
        message: "",
        ticketsList: "",
    };
    TicetModel.find({curatorId: req.user.userId,
        isDeleted: false},function(err, ticetsList){
        if (err){
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        } 
        if(ticetsList.length == 0){
            result.status = "error";
            result.message = "Записи не найдены";
            return res.send({result: result});
        } else {
            result.status = "OK";
            result.ticketsList = ticetsList;
            return res.send({result: result});
        }
    })
});

//получение списка юзеров

app.get('/api/users/list',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    if (req.user.status != 'Администратор'){
        result.status = "error";
        result.message = 'Недостатоно прав для совершения действия'
        return res.send({result: result});
    }
    var result = {
        status: "",
        message: "",
        usersList: "",
    };
    UserModel.find({isDeleted: false},
        'UserName userId phone office status createdAt email',
    function(err, usersList){
        if (err){
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        } 
        if(usersList.length == 0){
            result.status = "error";
            result.message = "Записи профилей пользователей не найдены";
            return res.send({result: result});
        } else {
            result.status = "OK";
            result.usersList = usersList;
            return res.send({result: result});
        }
    })
});

//получение списка администраторов

app.get('/api/users/getAdminsList',
 passport.authenticate('jwt', { session: false}),
 function(req, res){
    var result = {
        status: "",
        message: "",
        usersList: "",
    };
    UserModel.find({
        status: "Администратор",
        isDeleted: false},
    'UserName userId',
    function(err, usersList){
        if (err){
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        }
        if(usersList.length == 0){
            result.status = "error";
            result.message = "Администраторы не найдены";
            return res.send({result: result});
        } else {
            result.status = "OK";
            result.usersList = usersList;
            return res.send({result: result});
        }
    })
});

//создание коментария

app.post('/api/comment/create',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
        var comment = new CommentModel ({
            ticetId: req.body.ticetId,
            UserName: req.body.UserName,
            userId: req.body.userId,
            text: req.body.text
        })
        var result = {
            status: "",
            message: ""
        }
        comment.save(function(err){
            if (err){
                result.status = "error";
                result.message = err;
                return res.send({result: result});
            }
            result.status = "OK";
            result.message = "Коментарий создан";
            return res.send({result: result});
        })
});

//получение списка коментариев

app.get('/api/comment/getList',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
        var result = {
            status: "",
            message: "",
            commentList: ""
        }
        CommentModel.find(
            {ticetId: req.query.id,
            isDeleted: false}).sort('-modified').exec(
        function(err, commentList){
            if (err){
                result.status = "error";
                result.message = err;
                return res.send({result: result});
            } 
            if(commentList.length == 0){
                result.status = "error";
                result.message = "Коментарии отсутствуют";
                return res.send({result: result});
            } else {
                result.status = "OK";
                result.commentList = commentList;
                return res.send({result: result});
            }
        })
});

//установка флага на удаление коментария коментариев

app.put('/api/comment/delete',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
        var result = {
            status: "",
            message: ""
        }
        CommentModel.findById(req.body.id,
        function(err, comment){
            if (err){
                result.status = "error";
                result.message = err;
                return res.send({result: result});
            };
            comment.isDeleted = true;
            comment.save(function(err){
                if (err){
                    result.status = "error";
                    result.message = err;
                    return res.send({result: result});
                }
                result.status = "OK";
                result.message = "Коментарий удален";
                return res.send({result: result});
            })
        })
});

//установка флага на удаление пользоваеля

app.put('/api/users/delete',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    if (req.user.status != 'Администратор'){
        result.status = "error";
        result.message = 'Недостатоно прав для совершения действия'
        return res.send({result: result});
    }
    var result = {
        status: "",
        message: ""
    }
    UserModel.findById(req.body.id,
    function(err, user){
        if (err){
                result.status = "error";
            result.message = err;
            return res.send({result: result});
        };
        user.isDeleted = true;
        user.save(function(err){
            if (err){
                result.status = "error";
                result.message = err;
                return res.send({result: result});
            }
            result.status = "OK";
            result.message = "Пользователь удален";
            return res.send({result: result});
        })
    })
});

//установка флага на удаление тикета

app.put('/api/ticets/delete',
    passport.authenticate('jwt', { session: false}),
    function(req, res){
    if (req.user.status != 'Администратор'){
        result.status = "error";
        result.message = 'Недостатоно прав для совершения действия'
        return res.send({result: result});
    }
    var result = {
        status: "",
        message: ""
    }
    TicetModel.findById(req.body.id,
    function(err, ticet){
        if (err){
            result.status = "error";
            result.message = err;
            return res.send({result: result});
        };
        ticet.isDeleted = true;
        ticet.save(function(err){
            if (err){
                result.status = "error";
                result.message = err;
                return res.send({result: result});
            }
            result.status = "OK";
            result.message = "Заявка удалена";
            return res.send({result: result});
        })
    })
});

//создание пользователя

app.post('/api/user/create', function(req, res){
    var user = new UserModel ({
        email: req.body.email,
        password: req.body.password,
        UserName: req.body.userName,
        userId: "",
        phone: req.body.phone,
        office: req.body.office,
        status: req.body.status
    });
    var result = {
        status: "",
        message: ""
    }
    UserModel.count().exec(function(err, count){
        if (err){
            res.send({error: err})
        }
        user.userId = Math.ceil(count + 1);
        user.save(function(err) {
            if(!err){
                result.status = "OK";
                result.message = "Пользователь создан";
                return res.send({result: result});
            } else {
                result.status = "error";
                result.message = err;
                return res.send({result: result});
            }
        });
    })
});

//авторизация

app.post('/api/login', passport.authenticate('local', { session: false }), function(req, res, next) {
    if(!req.user) {
        res.statusCode = 404;
        return res.send ({ error: 'Not found user'});
    } else {
        var payloadAccess = {
            id: req.user.id,
            UserName: req.user.UserName,
            status: req.user.status,
            iat: Math.floor(Date.now()/1000)
        };    
        var payloadRefresh = {
            id: req.user.id,
            UserName: req.user.UserName,
            status: req.user.status,
            iat: Math.floor(Date.now()/1000)
        };
        var accessToken = jwt.sign(payloadAccess, jwtsecret);
        var refreshTokenGen = jwt.sign(payloadRefresh, jwtsecret);
        RefreshTokenModel.findOne({userId: req.user.id}, function(err, refToken){
            if (err){
                return res.send("Ошибка RefreshModel" + err);
            }
            if(refToken){
                refToken.token = refreshTokenGen;
                refToken.save(function(err){
                    if (err){ 
                        return done(err)
                    } else {
                        console.log('RefreshToken обновлен')
                    }
            });
            } else {
                var refreshToken = new RefreshTokenModel({ userId: req.user.id, token: refreshTokenGen});
                refreshToken.save(function(err){
                    if (err){ 
                        return done(err)
                    } else {
                        console.log('RefreshToken сохранен')
                    }
                });
            }
        });
        return res.send ({
            UserName: req.user.UserName,
            userId: req.user.userId,
            status: req.user.status,
            accessToken: 'JWT ' + accessToken,
            refreshToken: refreshTokenGen });
    }
});

//ошибки

app.use(function(req, res, next){
    res.status(404);
    console.log("Not found URL: %s", req.url);
    res.send({error: "Not found"});
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    console.log('Internal error(%d): %s',res.statusCode,err.message);
    res.send({error: err.message});
    return;
});

//запуск сервера node

app.listen(3000, function() {
    console.log(`API running on 3000 port`)
});
