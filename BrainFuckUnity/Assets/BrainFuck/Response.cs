﻿using UnityEngine;
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
    public string[] com;
    public string[] fac;
    public string[] sys;
    public string sid;
    public string time;
}

[System.Serializable]
public class RESULT_CLASS
{
    public string _auth;
    public string appId;
    public string id;
}

