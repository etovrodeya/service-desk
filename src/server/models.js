const mongoose = require('mongoose');
const crypto = require('crypto');

mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;

db.once('open', function callback () {
    console.log("Connected to DB!");
});

const userSchema = new mongoose.Schema({
    UserName: String,
    userId:{
        type: Number,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    office: {
        type: String
    },
    status: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    passwordHash: String,
    salt: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

userSchema.virtual('password')
.set(function (password) {
    this._plainPassword = password;
    if (password) {
        this.salt = crypto.randomBytes(128).toString('base64');
        this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
    }
    else {
        this.salt = undefined;
        this.passwordHash = undefined;
    }
})
.get(function () {
    return this._plainPassword;
})

userSchema.methods.checkPassword = function (password) {
    if (!password) return false;
    if (!this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

var UserModel = mongoose.model('User', userSchema);

const ticetSchema = new mongoose.Schema({
    title: {
        type: String
    },
    userName: {
        type: String
    },
    userId:{
        type: Number,
    },
    description: {
        type: String
    },
    ticetId: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String
    },
    curator: {
        type: String
    },
    curatorId: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

const TicetModel = mongoose.model('Ticet', ticetSchema);

var refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    }
});

const RefreshTokenModel = mongoose.model('refreshToken', refreshTokenSchema);

const commentSchema = new mongoose.Schema({
    ticetId: {
        type: Number,
    },
    UserName: {
        type: String,
    },
    userId: {
        type: Number,
    },
    text: {
        type: String,
    },
    modified: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const CommentModel = mongoose.model('comment', commentSchema);

module.exports.TicetModel = TicetModel;
module.exports.CommentModel = CommentModel;
module.exports.UserModel = UserModel;
module.exports.RefreshTokenModel = RefreshTokenModel;

