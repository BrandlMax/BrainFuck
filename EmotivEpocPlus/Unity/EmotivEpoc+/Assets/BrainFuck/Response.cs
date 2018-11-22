using UnityEngine;
using UnityEngine.Events;
using System.Collections;
using System.Collections.Generic;

[System.Serializable]
public class RES_CLASS
{
    public string jsonrpc;
    public RESULT_CLASS result;
    public RESULT_CLASS undefClass;
    public string undef;
}

[System.Serializable]
public class RESULT_CLASS
{
    public string _auth;
    public string appID;
    public string id;
}

