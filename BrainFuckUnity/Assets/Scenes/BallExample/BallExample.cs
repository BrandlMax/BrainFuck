using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class BallExample : MonoBehaviour
{

    public GameObject BallObject;
    public BrainFuck EPOC;

    private Rigidbody Ball;

    // Use this for initialization
    void Start()
    {
        // 01. CONNECT

        EPOC = new BrainFuck("INSERT_YOUR_HEADSET_ID");

        string client_id = "INSERT_YOUR_CLIENT_ID";
        string client_secret = "INSERT_YOUR_CLIENT_SECRET";
        EPOC.Connect(client_id, client_secret);

        EPOC.On("Ready", Ready);
        EPOC.On("Stream", Stream);

        Ball = BallObject.GetComponent<Rigidbody>();
    }

    // 02. INITIALIZE
    void Ready()
    {
        Debug.Log("EPOC Ready!");
        EPOC.LoadProfile("INSERT_YOUR_PROFILE_NAME");
        EPOC.StartStream();
    }

    // 03. DATA STREAM
    void Stream()
    {
        // DO THINGS WITH COMMANDS AND FACE-ACTIONS...
        Debug.Log($"command: { EPOC.BRAIN.command } | eyeAction: { EPOC.BRAIN.eyeAction } | upperFaceAction: { EPOC.BRAIN.upperFaceAction } | lowerFaceAction: { EPOC.BRAIN.lowerFaceAction }");
    }


    // Update is called once per frame
    void FixedUpdate()
    {

        Vector3 movement = new Vector3(0.0f, 0.0f, 0.0f);

        if (EPOC.BRAIN.command == "push")
        {
            movement = new Vector3(0.0f, 0.0f, 1.0f);
        }
        if (EPOC.BRAIN.command == "pull")
        {
            movement = new Vector3(0.0f, 0.0f, -1.0f);
        }
        if (EPOC.BRAIN.command == "left")
        {
            movement = new Vector3(-1.0f, 0.0f, 0.0f);
        }
        if (EPOC.BRAIN.command == "right")
        {
            movement = new Vector3(1.0f, 0.0f, 0.0f);
        }


        Ball.AddForce(movement);
    }

}
