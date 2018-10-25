const WebSocket = require("ws");
const EventEmitter = require("events");

// Fixes "Error: unable to verify the first certificate"
if (global.process) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// HELPER
const safeParse = msg => {
    try {
        return JSON.parse(msg);
    } catch (_) {
        return null;
    }
}

// CLASS
class BrainFuck extends EventEmitter {
    constructor(){

        super();
        this.CORTEX_URL = "wss://emotivcortex.com:54321";
        this.WS;
        this.TOKEN;
        this.SESSION = null;

        this.BRAIN = {
            command: null,
            eyeAction: null,
            upperFaceAction: null,
            lowerFaceAction: null,
        }

        // BINDING
        this.createSession = this.createSession.bind(this);
        this.Subscribe = this.Subscribe.bind(this);

        // EVENTS
        this.on('Authorized', () => {
            console.log('Authentification')
            this.createSession()
        })

        this.on('createSession', () => {
            this.emit('Ready');
            console.log('Session created')
        })

    }

    // SETUP
    async Connect(){
        this.WS = new WebSocket(this.CORTEX_URL);
        this.WS.addEventListener("open", this._open.bind(this));
        this.WS.addEventListener("message", this._message.bind(this));
    }

    _open(e){
        console.log('open', e);

        if(this.TOKEN == null){
            this._Authorize();
        }
    }

    _message(e){
        let msg = safeParse(e.data);
        console.log('message', msg);

        if(typeof msg.result !== 'undefined' && msg.result !== null){
        
            if (msg.result['_auth'] !== undefined){
                this.TOKEN = msg.result._auth;
                this.emit('Authorized');
            }

            if(msg.result['appId'] !== undefined){
                this.SESSION = msg.result.id;
                this.emit('createSession');
            }

        }else{
                
            if (msg['com'] !== undefined){
                console.log('com', msg.com)
                this.BRAIN.command = msg.com[0]
            }

            if (msg['fac'] !== undefined){
                console.log('fac', msg.fac)
                this.BRAIN.eyeAction = msg.fac[0]
                this.BRAIN.upperFaceAction = msg.fac[1]
                this.BRAIN.lowerFaceAction = msg.fac[3]
            }

        }
        
        console.log(`command: ${ this.BRAIN.command } | eyeAction: ${ this.BRAIN.eyeAction }| upperFaceAction: ${ this.BRAIN.upperFaceAction }| lowerFaceAction: ${ this.BRAIN.lowerFaceAction } `)
    }

    // ACTIONS
    _Authorize(){
        let AuthReq = {
            "jsonrpc": "2.0",
            "method": "authorize",
            "params": {},
            "id": 1
        }
        this.WS.send(JSON.stringify(AuthReq));
    }

    // Create Session
    createSession(){
        let createSessionReq = {
            "jsonrpc": "2.0",
            "method": "createSession",
            "params": {
            "_auth": this.TOKEN,
            "status": "open"
            },
            "id": 1
        }
        this.WS.send(JSON.stringify(createSessionReq));
    }

    // Subscribe
    Subscribe(){
        let SubscribeReq = {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
              "_auth": this.TOKEN,
              "streams": [
                "com",
                "fac",
                "sys"
              ]
            },
            "id": 1
        }
        this.WS.send(JSON.stringify(SubscribeReq));
    }

    // Training
    SetupProfile(){
        // Load or Create
    }

    Training(){

    }

    EndTraining(){

    }
}

module.exports = BrainFuck;