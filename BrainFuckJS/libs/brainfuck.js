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
    constructor(headsetName){

        super();
        this.HEADSETNAME = headsetName;
        this.CORTEX_URL = "wss://emotivcortex.com:54321";
        this.WS;
        this.TOKEN;
        this.CLIENT_ID;
        this.CLIENT_SECRET;
        this.SESSION = null;
        this.READY = false;
        this.STREAMREADY = false;

        this.CURPROFILE = null
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
            this.emit('Ready');
            this.READY = true;
        })

        this.on('subscribed', ()=>{
            console.log('Subscribed');
            this.STREAMREADY = true;
        })

        // Training
        this.on('trainingStarted', () => {
            console.log(`Training ${this.CURTRAINING } Started.`)
        });

        this.on('trainingSucceeded', () => {
            this._training(this.CURTRAINING, 'accept')
        });

        this.on('trainingCompleted', () => {
            console.log(`Training ${this.CURTRAINING } Completed.`)
            this.saveProfile(this.CURPROFILE)
        });

    }

    // SETUP
    async Connect(client_id, client_secret){

        this.CLIENT_ID = client_id;
        this.CLIENT_SECRET = client_secret;
        
        this.WS = new WebSocket(this.CORTEX_URL);
        this.WS.addEventListener("open", this._open.bind(this));
        this.WS.addEventListener("message", this._message.bind(this));
    }

    _open(e){
        // console.log('open', e);
        
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
                if(!this.STREAMREADY){
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
                if (msg['sys'][1] == 'MC_Started'){
                    this.emit('trainingStarted');
                } else if(msg['sys'][1] == 'MC_Succeeded') {
                    this.emit('trainingSucceeded');
                } else if(msg['sys'][1] == 'MC_Completed'){
                    this.emit('trainingCompleted');
                } else {
                    console.log('trainingsMessage', msg)
                }
            }

            if (msg['error'] !== undefined){
                console.log(msg['error'])
            }

        }
        
        if(this.STREAMREADY){
            this.emit('Stream', this.BRAIN);
        }
    }

    // ACTIONS
    _authorize(){
        let AuthReq = {
            "jsonrpc": "2.0",
            "method": "authorize",
            "params": {
                "client_id": this.CLIENT_ID,
                "client_secret": this.CLIENT_SECRET
            },
            "id": 1
        }
        this.WS.send(JSON.stringify(AuthReq));
    }


    // Create Session
    _createSession(){
        let CreateSessionReq = {
            "jsonrpc": "2.0",
            "method": "createSession",
            "params": {
                "_auth": this.TOKEN,
                "status": "open"
            },
            "id": 1
        }
        this.WS.send(JSON.stringify(CreateSessionReq));
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

    // Start Stream
    startStream(){
        this._subscribe();
    }
    
    // Load Profile
    loadProfile(profile) {
        this.CURPROFILE = profile;
        let loadProfileReq = {
            "jsonrpc": "2.0",
            "method": "setupProfile",
            "params": {
                "_auth": this.TOKEN,
                "headset": this.HEADSETNAME,
                "profile": profile,
                "status": "load"
            },
            "id": 1
        }
        this.WS.send(JSON.stringify(loadProfileReq))
    }

    createProfile(profile) {
        this.CURPROFILE = profile;
        let createProfileReq = {
            "jsonrpc": "2.0",
            "method": "setupProfile",
            "params": {
                "_auth": this.TOKEN,
                "headset": this.HEADSETNAME,
                "profile": profile,
                "status": "create"
            },
            "id": 1
        }
        this.WS.send(JSON.stringify(createProfileReq))
    }

    saveProfile(profile) {
        this.CURPROFILE = profile;
        let saveProfileReq = {
            "jsonrpc": "2.0",
            "method": "setupProfile",
            "params": {
                "_auth": this.TOKEN,
                "headset": this.HEADSETNAME,
                "profile": profile,
                "status": "save"
            },
            "id": 1
        }
        this.WS.send(JSON.stringify(saveProfileReq))
    }

    getCurrentProfile(){
        let getCurrentProfileReq = {
            "jsonrpc": "2.0",
            "method": "getCurrentProfile",
            "params": {
              "_auth": this.TOKEN,
              "headset": this.HEADSETNAME,
            },
            "id": 1
        }
        this.WS.send(JSON.stringify(getCurrentProfileReq))
    }

    // Todo: Training
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

    // Wildcard
    toCortexAPI(json){
        this.WS.send(JSON.stringify(json));
    }
}

module.exports = BrainFuck;