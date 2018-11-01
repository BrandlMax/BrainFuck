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
        this.READY = false;

        this.CURTRAINING = null;

        this.BRAIN = {
            command: null,
            eyeAction: null,
            upperFaceAction: null,
            lowerFaceAction: null,
        }

        // BINDING
        this._createSession = this._createSession.bind(this);
        this._subscribe = this._subscribe.bind(this);
        this._training = this._training.bind(this);
        this.startTraining = this.startTraining.bind(this);

        // EVENTS
        this.on('Authorized', () => {
            console.log('Authentification')
            this._createSession()
        })

        this.on('createdSession', () => {
            console.log('Session created');
            this._subscribe();
        })

        this.on('subscribed', ()=>{
            console.log('Subscribed');
            this.emit('Ready');
            this.READY = true;
        })

        // Training
        this.on('trainingSuccess', () => {
            this._training(this.CURTRAINING, 'accept')
        });

        this.on('trainingFailed', () => {
            console.log(`Training ${this.CURTRAINING } Failed.`)
        });

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
            this._authorize();
        }
    }

    _message(e){
        let msg = safeParse(e.data);
        // console.log('message', msg);

        if(typeof msg.result !== 'undefined' && msg.result !== null){
        
            if (msg.result['_auth'] !== undefined){
                this.TOKEN = msg.result._auth;
                this.emit('Authorized');
            }

            if(msg.result['appId'] !== undefined){
                this.SESSION = msg.result.id;
                this.emit('createdSession');
            } else{
                console.log(msg.result);
            }

        }else{
                
            if (msg['com'] !== undefined){
                // console.log('com', msg.com)
                this.BRAIN.command = msg.com[0]
                if(!this.READY){
                    this.emit('subscribed');
                }
            }

            if (msg['fac'] !== undefined){
                // console.log('fac', msg.fac)
                this.BRAIN.eyeAction = msg.fac[0]
                this.BRAIN.upperFaceAction = msg.fac[1]
                this.BRAIN.lowerFaceAction = msg.fac[3]
            }

            if (msg['sys'] !== undefined){
                console.log(msg)
                // console.log('com', msg.com)
                if (msg['sys'][1] == 'MC_Completed'){
                    this.emit('trainingSuccess');
                } else {
                    this.emit('trainingFailed');
                }
            }

            if (msg['error'] !== undefined){
                console.log(msg['error'])
            }

        }
        
        this.emit('Stream', this.BRAIN);
    }

    // ACTIONS
    _authorize(){
        let AuthReq = {
            "jsonrpc": "2.0",
            "method": "authorize",
            "params": {},
            "id": 1
        }
        this.WS.send(JSON.stringify(AuthReq));
    }


    // Create Session
    _createSession(){
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
    _subscribe(){
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
    _training(action, status){
        this.CURTRAINING = action;

        let trainingReq = {
            "jsonrpc": "2.0",
            "method": "training",
            "params": {
                "_auth": this.TOKEN,
                "detection": "mentalCommand",
                "session": this.SESSION,
                "action": action,
                "status": status
            },
            "id": 1
        }
        this.WS.send(JSON.stringify(trainingReq));
    }

    startTraining(action){
        this._training(action, 'start');
    }
}

module.exports = BrainFuck;