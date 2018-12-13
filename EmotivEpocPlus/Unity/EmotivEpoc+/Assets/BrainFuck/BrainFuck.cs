using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

using System;
using WebSocketSharp;
using System.Threading;

public class BrainFuck 
{

    private string HEADSETNAME;
    public string CORTEX_URL = "wss://emotivcortex.com:54321";
    private WebSocket WS;
    private string TOKEN;
    private string CLIENT_ID;
    private string CLIENT_SECRET;
    private string SESSION = null;
    private Boolean READY = false;
    private Boolean STREAMREADY = false;

    public BrainFuck(string HeadsetName){
        this.HEADSETNAME = HeadsetName;
    }

    public class BRAIN_CLASS
    {
        public string command = null;
        public string eyeAction = null;
        public string upperFaceAction = null;
        public string lowerFaceAction = null;
    }

    public BRAIN_CLASS BRAIN = new BRAIN_CLASS();

    // WEBSOCKET
    public void Connect(string client_id, string client_secret)
    {

        this.CLIENT_ID = client_id;
        this.CLIENT_SECRET = client_secret;

        WS = new WebSocket(CORTEX_URL);

        WS.OnOpen += _open;
        WS.OnMessage += _message;
        WS.OnClose += _close;

        WS.ConnectAsync();

    }

    private void _open(object sender, System.EventArgs e)
    {
        Debug.Log("open " + e);

        if (TOKEN == null)
        {
            _authorize();
        }


        // EVENTS

        this.On("test", () => {
            Debug.Log("Test Event");
            Test();
        });

        this.On("authorized", () =>
        {
            Debug.Log("Authentification");
            this._createSession();
        });

        this.On("createdSession", () =>
        {
            Debug.Log("Session created");
            this.Emit("Ready");
            READY = true;
        });

        this.On("subscribed", () =>
        {
            Debug.Log("Subscribed");
            this.STREAMREADY = true;
        });

    }

    private void _message(object sender, MessageEventArgs e)
    {
        Debug.Log("WebSocket server said: " + e.Data);

        RES_CLASS msg = JsonUtility.FromJson<RES_CLASS>(e.Data.ToString());

        if (msg.result._auth != null)
        {
            this.TOKEN = msg.result._auth;
            Debug.Log("AUTH..." + TOKEN);
            this.Emit("authorized");

        }

        if (msg.result.appId != null)
        {
            Debug.Log("Create Session");
            this.SESSION = msg.result.id;
            this.Emit("createdSession");
        }

        if (msg.com != null)
        {
            this.BRAIN.command = msg.com[0].ToString();
            if (!this.STREAMREADY)
            {
                this.Emit("subscribed");
            }

        }

        if (msg.fac != null)
        {
            this.BRAIN.eyeAction = msg.fac[0].ToString();
            this.BRAIN.upperFaceAction = msg.fac[1].ToString();
            this.BRAIN.lowerFaceAction = msg.fac[3].ToString();
        }
        
        if (this.STREAMREADY || msg.fac != null || msg.com != null)
        {
            this.Emit("Stream");
        }

    }

    private void _close(object sender, CloseEventArgs e)
    {
        Debug.Log("WebSocket closed with reason: " + e.Reason);
    }

    private void _send(bool success)
    {
        Debug.Log("Message sent successfully? " + success);
    }


    // ACTION
    private void _authorize()
    {
        string AuthReq = "{\"jsonrpc\": \"2.0\", \"method\": \"authorize\", \"params\": {\"client_id\":\"" + CLIENT_ID + "\",\"client_secret\":\"" + CLIENT_SECRET + "\"}, \"id\": 1 }";
        //Debug.Log("AuthReq:" + AuthReq);
        WS.Send(AuthReq);
    }


    private void _createSession()
    {
        string CreateSessionReq = "{\"jsonrpc\": \"2.0\",\"method\": \"createSession\",\"params\": { \"_auth\":\"" + TOKEN + "\",\"status\": \"open\"},\"id\": 1}";
        //Debug.Log("Created:" + CreateSessionReq);
        WS.Send(CreateSessionReq);
    }


    private void _subscribe()
    {
        string SubscribeReq = "{\"jsonrpc\": \"2.0\",\"method\": \"subscribe\",\"params\": { \"_auth\":\"" + TOKEN + "\",\"streams\": [\"com\",\"fac\",\"sys\"]},\"id\": 1}";
        //Debug.Log("Subscrs:" + SubscribeReq);
        WS.Send(SubscribeReq);
    }

    public void StartStream()
    {
        this._subscribe();
    }

    public void LoadProfile(string profile)
    {
        string loadProfileReq = "{\"jsonrpc\": \"2.0\",\"method\": \"setupProfile\",\"params\": { \"_auth\":\"" + TOKEN + "\",\"headset\":\"" + HEADSETNAME+ "\",\"profile\":\"" + profile + "\",\"status\": \"load\"},\"id\": 1}";
        WS.Send(loadProfileReq);
    }

    public void GetCurrentProfile(string profile)
    {
        string getCurrentProfileReq = "{\"jsonrpc\": \"2.0\",\"method\": \"getCurrentProfile\",\"params\": { \"_auth\":\"" + TOKEN + "\",\"headset\":\"" + HEADSETNAME+ "\"},\"id\": 1}";
        WS.Send(getCurrentProfileReq);
    }

    // EVENT MANAGER
    public void On(string Event, UnityAction Callback)
    {
        EventManager.On(Event, Callback);
    }


    public void Emit(string Event)
    {
        Debug.Log("EMIT: " + Event);
        EventManager.Emit(Event);
    }

    public void Test()
    {

        Debug.Log("TESTILY TEST!");
    }

}