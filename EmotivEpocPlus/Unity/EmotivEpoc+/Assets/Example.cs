using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;



public class Example : MonoBehaviour
{

    public BrainFuck EPOC;

    // Use this for initialization
    void Start()
    {

        EPOC = new BrainFuck();
        Debug.Log("THIS EPOC" + EPOC);

        EPOC.Connect();

        EPOC.On("Ready", Ready);

        EPOC.On("Stream", Stream);

        EPOC.On("test", () => {
            // Stream();
            // Ready();
            // EPOC.Test();
        });
    }
	
	// Update is called once per frame
	void Update () {

        if (Input.GetKeyDown("q"))
        {
            EPOC.Emit("test");
        }

    }

    void Ready()
    {
        Debug.Log("EPOC Ready!");
    }

    void Stream()
    {
        Debug.Log("Stream is Running");
    }
}
