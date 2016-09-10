var app = require("express")();
var http = require("http").Server(app);
var io = require('socket.io')(http);
var faker = require('faker');

function generateNewUser() {
    var user = {
        name: faker.name.findName(),
        age: faker.random.number({"min":15, "max": 75}),
        img: faker.image.avatar()
    };

    return user;
}

function handleIO(socket) {
    console.log("user connected successfully");

    function disconnectLog() {
        console.log("user disconnected");
    }

    function sendNewUserToCliet() {
        var newUser = generateNewUser();
        socket.emit("send new user", newUser);
    }

    function disconnect() {
        socket.disconnect();
    }

    socket.on("disconnect", disconnectLog);
    socket.on("get new user", sendNewUserToCliet);
    socket.on("stop streamer", disconnect);
}


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

http.listen(3000, function () {
    console.log("listening to port :3000");
});

io.on("connection", handleIO);
