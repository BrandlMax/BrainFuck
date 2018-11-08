using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class Example : MonoBehaviour {

	// Use this for initialization
	void Start () {
        EventManager.On("test", SomeOtherFunction);

    }
	
	// Update is called once per frame
	void Update () {

        if (Input.GetKeyDown("q"))
        {
            EventManager.Emit("test");
        }

    }

    void SomeOtherFunction()
    {
        Debug.Log("Some Other Function was called!");
    }
}
