using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using System;
using WebSocketSharp;
using System.Threading;

public class BrainFuck : MonoBehaviour {


    public string CORTEX_URL = "wss://emotivcortex.com:54321";
    private WebSocket WS;
    private string TOKEN;
    private string SESSION = null;
    private Boolean READY = false;

    private class BRAIN_CLASS{
        public string command = null;
        public string eyeAction = null;
        public string upperFaceAction = null;
        public string lowerFaceAction = null;
    }
    private BRAIN_CLASS BRAIN = new BRAIN_CLASS();



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
        Debug.Log("open" + e);
    }

    private void _message(object sender, MessageEventArgs e)
    {
        Debug.Log("WebSocket server said: " + e.Data);
        Thread.Sleep(3000);
        WS.CloseAsync();
    }

    private void _close(object sender, CloseEventArgs e)
    {
        Debug.Log("WebSocket closed with reason: " + e.Reason);
    }

    private void _send(bool success)
    {
        Debug.Log("Message sent successfully? " + success);
    }

    // EVENTS


    //ACTIONS


}
