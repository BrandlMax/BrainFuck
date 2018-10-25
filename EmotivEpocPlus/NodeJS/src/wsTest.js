const WebSocket = require("ws");

const CORTEX_URL = "wss://emotivcortex.com:54321";

// Fixes "Error: unable to verify the first certificate"
if (global.process) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const ws = new WebSocket(CORTEX_URL);

let AUTH = false;
let AUTH_TOKEN = null;

let StreamData = {
    Command : null,
    FaceEvent: null,
    FaceExpression: null,
}


// REQUESTS
const AuthRequest = {
    "jsonrpc": "2.0",
    "method": "authorize",
    "params": {},
    "id": 1
}

const createSession = (AUTH_TOKEN) => {
    return {
        "jsonrpc": "2.0",
        "method": "createSession",
        "params": {
        "_auth": AUTH_TOKEN,
        "status": "open"
        },
        "id": 1
    }
}

const subscribe = (AUTH_TOKEN) =>{
    return {
        "jsonrpc": "2.0",
        "method": "subscribe",
        "params": {
          "_auth": AUTH_TOKEN,
          "streams": [
            "com",
            "fac",
            "sys"
          ]
        },
        "id": 1
    }
}

const loadProfile = (AUTH_TOKEN) =>{
    return {
        "jsonrpc": "2.0",
        "method": "setupProfile",
        "params": {
          "_auth": AUTH_TOKEN,
          "headset": "EPOCPLUS",
          "profile": "Max Intuitive",
          "status": "load"
        },
        "id": 1
      }
}

// FUNCTIONS

const writeStreamDate = () =>{
    // if (typeof(jsvariable) == 'undefined') {

    // }
}

// SOCKET
ws.on('open', function open() {
    console.log('Opened')

    ws.send(JSON.stringify(AuthRequest));
});

ws.on('message', function incoming(data) {
    // console.log('message', data);
    let DataJSON = JSON.parse(data);
    
    // Auth
    if(!AUTH){
        if (DataJSON.result._auth !== undefined){
            console.log('Authentification');
            AUTH_TOKEN = DataJSON.result._auth;
            console.log('AUTH_TOKEN', AUTH_TOKEN);
            ws.send(JSON.stringify(createSession(AUTH_TOKEN)));
            ws.send(JSON.stringify(subscribe(AUTH_TOKEN)));
            ws.send(JSON.stringify(loadProfile(AUTH_TOKEN)));
            AUTH = true;
        }
    }

    // Stream
    if(AUTH){
        if (DataJSON){
            console.log('Facial', DataJSON);
            // StreamData.Command = DataJSON.com[0]
            // StreamData.FaceEvent = DataJSON.fac[0]
            // StreamData.FaceExpression = DataJSON.fac[3]
            // console.log(`Command: ${ StreamData.Command } | FaceEvent: ${ StreamData.FaceEvent }| FaceExpression: ${ StreamData.FaceExpression }|`)
        }
    }
});