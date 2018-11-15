﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

using System;
using WebSocketSharp;
using System.Threading;

public class BrainFuck : MonoBehaviour {


    public string CORTEX_URL = "wss://emotivcortex.com:54321";
    private WebSocket WS;
    private string TOKEN;
    private string SESSION = null;
    private Boolean READY = false;

    private class RES_CLASS
    {

    };
    private RES_CLASS RES = new RES_CLASS();


    private class BRAIN_CLASS{
        public string command = null;
        public string eyeAction = null;
        public string upperFaceAction = null;
        public string lowerFaceAction = null;
    }

    private BRAIN_CLASS BRAIN = new BRAIN_CLASS();

    // DELEGATES
    public delegate void StreamFunction();

    // WEBSOCKET
    public void Connect()
    {
       
        WS = new WebSocket(CORTEX_URL);

        WS.OnOpen += _open;
        WS.OnMessage += _message;
        WS.OnClose += _close;

        WS.ConnectAsync();

    }

    private void _open(object sender, System.EventArgs e)
    {
        Debug.Log("open " + e);

        if(TOKEN == null){
            _authorize();
        }
    }

    private void _message(object sender, MessageEventArgs e)
    {
        Debug.Log("WebSocket server said: " + e.Data);

        RES_CLASS msg_obj = safeParse(e.Data);
        // TODO: JSON PARSING! 
        Debug.Log("MSGOBJ: " + msg_obj);

    }

    private void _close(object sender, CloseEventArgs e)
    {
        Debug.Log("WebSocket closed with reason: " + e.Reason);
    }

    private void _send(bool success)
    {
        Debug.Log("Message sent successfully? " + success);
    }

    // EVENT MANAGER
    public void On(string Event, UnityAction Callback)
    {
        EventManager.On(Event, Callback);
    }

    // EVENTS


    // ACTION
    private void _authorize()
    {
        string AuthReq = "{\"jsonrpc\": \"2.0\", \"method\": \"authorize\", \"params\": { }, \"id\": 1 }";
        Debug.Log("AuthReq:" + AuthReq);
        WS.Send(AuthReq);
    }


    private void _createSession()
    {
        string CreateSessionReq = "{\"jsonrpc\": \"2.0\",\"method\": \"createSession\",\"params\": { \"_auth\":" + TOKEN + ",\"status\": \"open\"},\"id\": 1}";
        Debug.Log("Created:" + CreateSessionReq);
        WS.Send(CreateSessionReq);
    }


    private void _Subscribe()
    {
        string SubscribeReq = "{\"jsonrpc\": \"2.0\",\"method\": \"subscribe\",\"params\": { \"_auth\":" + TOKEN + ",\"streams\": [\"com\",\"fac\",\"sys\"]},\"id\": 1}";
        Debug.Log("Subscrs:" + SubscribeReq);
        WS.Send(SubscribeReq);
    }


    // HELPER
    private RES_CLASS safeParse(string msg)
    {
        try
        {
            return JsonUtility.FromJson<RES_CLASS>(msg);
        }
        catch
        {
            Debug.Log("PARSING ERROR! " + msg);
            return null;
        }
    }
}
