using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;



public class EmptyExample : MonoBehaviour
{

    public BrainFuck EPOC;

    // Use this for initialization
    void Start()
    {
        // 01. CONNECT

        // e.g. EPOCPLUS-0000000
        EPOC = new BrainFuck("INSERT_YOUR_HEADSET_ID"); 

        // FROM YOUR EMOTIV ACCOUNT
        string client_id = "INSERT_YOUR_CLIENT_ID";
        string client_secret = "INSERT_YOUR_CLIENT_SECRET";
        EPOC.Connect(client_id, client_secret);

        // SETUP EVENTS
        EPOC.On("Ready", Ready);
        EPOC.On("Stream", Stream);
    }

    // 02. INITIALIZE
    void Ready()
    {
        Debug.Log("EPOC Ready!");

        // LOAD PRETRAINED PROFILE
        EPOC.LoadProfile("INSERT_YOUR_PROFILE_NAME");

        // START LOGGING
        EPOC.StartStream();
    }

    // 03. DATA STREAM
    void Stream()
    {
        // DO THINGS WITH COMMANDS AND FACE-ACTIONS...
        Debug.Log($"command: { EPOC.BRAIN.command } | eyeAction: { EPOC.BRAIN.eyeAction } | upperFaceAction: { EPOC.BRAIN.upperFaceAction } | lowerFaceAction: { EPOC.BRAIN.lowerFaceAction }");
    }


    // Update is called once per frame
    void Update()
    {

    }

}
