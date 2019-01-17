# BrainFuck 🧠
BrainFuck is a small framework to quickly and easily write small BCI prototypes for the Emotiv EPOC+.

I created this framework as part of a free elective with Prof. Dr.-Ing. Martin Leissler in order to make it easier for future students to get started with BCI using the Emotiv EPOC.

This framework allows easy communication with the CortexAPI:<br />
[https://emotiv.github.io/cortex-docs/#introduction](https://emotiv.github.io/cortex-docs/#introduction)

The framework is available in a NodeJS and a Unity version.

# Emotive EPOC+

## Setup

### Software
First you have to create an account at Emotiv. The EPOC data, e.g. trained profiles, will be uploaded to this account. 
[https://id.emotivcloud.com/eoidc/account/registration/](https://id.emotivcloud.com/eoidc/account/registration/)

Furthermore 2 Emotiv apps are required:

**EmotiveBCI** <br />
Needed for training profiles. <br />
[https://www.emotiv.com/product/emotiv-bci/](https://www.emotiv.com/product/emotiv-bci/)

**Emotive CortexUI** <br />
Needed to connect to third party apps (like Brainfuck). <br />
[https://www.emotiv.com/developer/](https://www.emotiv.com/developer/)


### Hardware
#### 1. Charge your headset. <br />
Set your headset to the “off” position before charging. It
takes about 4 hours for the headset to be charged
completely. The headset should not be charged on the head.

#### 2. Hydrate the sensors. <br />
Always hydrate the sensors in the provided Hydrator Pack.
The felt pads must be fully saturated with saline solution
for good contact to be achieved. Keep the large white
hydrator pad on the top cover of the hydrator pack dry.
This will help dry the felt pads when they are not in use
and reduce oxidation. Note: Replenish with standard
multipurpose contact lens saline solution.

#### 3. Install the sensors. <br />
Remove the sensor units with their felt pads from the
hydrator pack and insert each one into the black plastic
headset arms, gently turning each one clockwise
one-quarter turn until you feel a "click.” Take care not to
force sensors in place. The sensor units should be stored
in the hydrator pack when not in use.

*Install sensors with a gentle clockwise turn.*

#### 4. Fitting the headset. <br />
Using both hands, slide the headset down from the top of
your head. WARNING: DO NOT STRETCH OPEN THE
HEADSET. It should glide onto the head.
The reference sensors have a black rubber covering.
Position these sensors on the bone just behind each ear
lobe. Correct placement of the reference sensors is critical
for correct operation.
The two front sensors should be approximately at the
hairline or about the width of 3 fingers above the eyebrows.
Pair your EPOC/EPOC+ via Bluetooth or USB.
Press and hold the 2 reference sensors (located just above
and behind your ears) for about 20 seconds

Extract from EMOTIV EPOC AND EPOC+ Quick Start Guide:<br />
[https://www.emotiv.com/files/Emotiv-Epoc-Quick-Start-Guide-2015.pdf](https://www.emotiv.com/files/Emotiv-Epoc-Quick-Start-Guide-2015.pdf)

In the Emotive BCI and the Emotive CortexUI App you can check the connection quality. This should always be 100% for successful training results.


## Training

Training is the hardest part. As with any sport, regular training is essential in order to reproduce patterns as repeatable and trouble-free as possible.

**Choosing your thought:** <br />
The thought that you train on and use for your Mental Commands can be anything. They can be literal (i.e. you can try and focus on pushing the virtual box) or they can be as abstract as you like (i.e. where push is associated with visualizing a scene or counting backwards from 500 in steps of 7). The possibilities are endless. Different strategies work best for different people, so try a few out.

**Words of encouragement:** <br />
Controlling machines with your mind is hard. Do not be discouraged if you are not able to master mind control right away. Being able to recreate a thought in your mind at will is something that take practice for most of us to learn. It is like learning how to generate certain patterns of brain activity to learn how to walk or talk. Practice certainly does help and you will likely find that with repeated trainings, your ability to trigger a command at will becomes much easier.

Extract from Tips and Tricks: <br />
[https://emotiv.gitbook.io/emotivbci/mental-commands/tips-and-tricks](https://emotiv.gitbook.io/emotivbci/mental-commands/tips-and-tricks)

Each of us trains differently, so it's important to find out which strategy works best for you. This will take some time and should not be underestimated. And yet, after some training, the results are magical.

# Brainfuck Framework
## Setup

1. Download the Code and Examples from the Git Repository: <br />
[https://github.com/BrandlMax/BrainFuck](https://github.com/BrandlMax/BrainFuck)

2. Open Emotive CortexUI App and connect the prepared headset. The device is then ready to communicate with Brainfuck via CortexAPI.

### Required Informations
To establish a connection we need the Headset-ID. We find this under Devices in our EmotivBCI or CortexUI App. Looks like this: ````EPOCPLUS-1A2BCD34```.

And we have to register a Cortex-App which is very easy on this site: <br />
https://www.emotiv.com/my-account/cortex-apps/

Now you have your ```client_id``` and your ```client_secret```.

Note: Make a good note of the client-secret, because it cannot be displayed again ;)

## Brainfuck Unity

### Setup Environment

The ```BrainFuckUnity``` Folder contains an example Unity project with 2 scenes.

In the project the ```BrainFuck``` folder is needed, here is the framework. You can also simply add it to existing projects.  In the scene itself an object with the logic is needed. In the examples this is an Empty where the logic script AND the event manager script are added as components.

The BrainFuck folder also contains Websocket-Sharp (MIT LICENSE), which we use to communicate with CortexAPI.
<br /> https://github.com/sta/websocket-sharp 

### Basic Example
```csharp
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

```

Above we can see an example code. This can also be used as basic logic.

First we establish a connection to CortexAPI. For this we need the headset ID and a registered emotive application. More infos under the point ````Required Informations````

```csharp
        // e.g. EPOCPLUS-0000000
        EPOC = new BrainFuck("INSERT_YOUR_HEADSET_ID"); 

        // FROM YOUR EMOTIV ACCOUNT
        string client_id = "INSERT_YOUR_CLIENT_ID";
        string client_secret = "INSERT_YOUR_CLIENT_SECRET";
        EPOC.Connect(client_id, client_secret);
```

Then we register 2 events:

 ```csharp
         // SETUP EVENTS
        EPOC.On("Ready", Ready);
        EPOC.On("Stream", Stream);
 ```

### Ready()
```Ready()``` is executed when the connection is established and everything is ready for the API commands. <br />

### Stream()
```Stream()``` is executed every time we get new data from the headset, after calling the ```EPOC.StartStream()``` in ```Ready()```. 

### EPOC.BRAIN
After the stream has been started the current states are available in the ```EPOC.BRAIN``` object

```
EPOC.BRAIN.command
EPOC.BRAIN.eyeAction 
EPOC.BRAIN.upperFaceAction
EPOC.BRAIN.lowerFaceAction
```

### Load pretrained Profile

Within the ```Ready()``` we can now load a profile trained by us in the EmotivBCI app.

```csharp
EPOC.LoadProfile("INSERT_YOUR_PROFILE_NAME");
```

If we then start the stream ```EPOC.StartStream()```, the commands in ```EPOC.BRAIN``` should already react to our profile.

### Training
To start a training with Brainfuck Unity you must first have a profile loaded ```EPOC.LoadProfile("YourProfileName"); ``` or created ```EPOC.CreateProfile("YourProfileName"); ```.

Then you can start a training process with one of the commands provided by Emotive:
```csharp
"neutral"
"push"
"pull"
"lift"
"drop"
"left"
"right"
"rotateLeft"
"rotateRight"
"rotateClockwise"
"rotateCounterClockwise"
"rotateForwards"
"rotateReverse"
"disappear"
```

```csharp
EPOC.StartTraining("pull");
```

After that an 8 second training is started. To watch the training events you have to activate the following event listeners in ```start()```:
```csharp

setup(){

    ...

    // SETUP EVENTS
    EPOC.On("Ready", Ready);
    EPOC.On("Stream", Stream);

    EPOC.On("trainingStarted", TrainingStarted);
    EPOC.On("trainingSucceeded", TrainingsSucceeded);
    EPOC.On("trainingCompleted", TrainingCompleted);
}
        
        ...

void TrainingStarted(){

}

void TrainingsSucceeded(){

}

void TrainingCompleted(){

}
		     
 
```

The results and steps are also displayed in the console. With the EmotivBCI app you can view your profile, your training will be registered here as well.

### Wildcard

There are countless other API commands of the Cortex API: <br />
[https://emotiv.github.io/cortex-docs/#introduction](https://emotiv.github.io/cortex-docs/#introduction)
To be able to use them with Brainfuck Unity, although they are not yet implemented, there is a function with which you can make Api calls.
```csharp
 EPOC.ToCortexAPI(json)
```

A training would look like this:
```csharp
String YourRequest = "{\"jsonrpc\": \"2.0\",\"method\": \"training\",\"params\": { \"_auth\":\"" + TOKEN + "\",\"detection\":\"mentalCommand\",\"session\":\"" + SESSION + "\",\"action\":\"" + action + "\",\"status\":\"" + status + "\"},\"id\": 1}

EPOC.ToCortexAPI(YourRequest);

```

Here, too, I would be happy if volunteers would continue to work on the project and implement additional functions ❤️

### Ball Example
In the Ball Example Scene we use commands to move a ball with the power of our thoughts in 3D space ;)
But you have to train a profile with the EmotivBCI App that can recognize Push, Pull, Left and Right.

```csharp
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
```

## BrainfuckJS
This version of Brainfuck runs with NodeJS.

### Setup Environment

Just import the ```brainfuck.js``` from the ```libs``` folder.

```javascript
const BrainFuck = require("path/to/libs/brainfuck");
```

Brainfuck needs ```ws``` (MIT LICENSE) for the websocket:<br />
https://github.com/websockets/ws

```
npm install --save ws
```

If you take the folder from this repository, you can also simply use npm or Yarn to get all dependencies.

npm:
```
npm install
```

yarn:
```
yarn install
```

And to run, for example::
```
node src/server/NodeExample.js  
```


### Basic Example
```javascript
const BrainFuck = require("../../libs/brainfuck");

const EPOC = new BrainFuck('INSERT_YOUR_HEADSET_ID');

let client_id = 'INSERT_YOUR_CLIENT_ID';
let client_secret = 'INSERT_YOUR_CLIENT_SECRET';

// 01. CONNECT
EPOC.Connect(client_id, client_secret);

// 02. INITIALIZE
EPOC.on('Ready', () => {
    console.log('READY!');
    EPOC.loadProfile('INSERT_YOUR_PROFILE_NAME');
    EPOC.startStream();
});

// 03. DATA STREAM
EPOC.on('Stream', (data) =>{
    // DO THINGS WITH COMMANDS AND FACE-ACTIONS...
    console.log(`command: ${ data.command } | eyeAction: ${ data.eyeAction } | upperFaceAction: ${ data.upperFaceAction } | lowerFaceAction: ${ data.lowerFaceAction } `)
})
```

Similar to the Unity version, we build a connection to the CortexAPI with our Headset-ID and our data from the registered emotive application. More infos under the point ````Required Informations````

```javascript
const EPOC = new BrainFuck('INSERT_YOUR_HEADSET_ID');

let client_id = 'INSERT_YOUR_CLIENT_ID';
let client_secret = 'INSERT_YOUR_CLIENT_SECRET';

// 01. CONNECT
EPOC.Connect(client_id, client_secret);
```

### EPOC.on('Ready', callback)
The callback is executed when the connection is established and everything is ready for the API commands. 
### EPOC.on('Stream', callback(data))
 The callback is executed every time we get new data from the headset, after calling the ```EPOC.startStream()``` in the Ready callback. We get a parameter in this callback that contains the current states.
 
 ```javascript
data.command
data.eyeAction
data.upperFaceAction
data.lowerFaceAction
 ```

### Load pretrained Profile

See ```Load pretrained Profile``` on the ```Brainfuck Unity``` Section 

```javascript
EPOC.loadProfile('INSERT_YOUR_PROFILE_NAME');
```

### Training

To start a training with Brainfuck JS you must first have a profile loaded ```EPOC.loadProfile('YourProfileName'); ``` or created ```EPOC.createProfile('YourProfileName'); ```.

Then you can start a training process with one of the commands provided by Emotive:
```javascript
"neutral"
"push"
"pull"
"lift"
"drop"
"left"
"right"
"rotateLeft"
"rotateRight"
"rotateClockwise"
"rotateCounterClockwise"
"rotateForwards"
"rotateReverse"
"disappear"
```

```javascript
EPOC.startTraining('push')
```

After that an 8 second training is started. You can watch the training with the following events:
```javascript
EPOC.on('trainingStarted', () => {
	// Your Code
})

EPOC.on('trainingSucceeded', () => {
	// Your Code
})

EPOC.on('trainingCompleted', () => {
	// Your Code
})

```

The results and steps are also displayed in the console. With the EmotivBCI app you can view your profile, your training will be registered here as well.

### Wildcard

There are countless other API commands of the Cortex API: <br />
[https://emotiv.github.io/cortex-docs/#introduction](https://emotiv.github.io/cortex-docs/#introduction)
To be able to use them with Brainfuck, although they are not yet implemented, there is a function with which you can make Api calls.

```javascript
 EPOC.toCortexAPI(json)
```

A training would look like this:
```javascript
let YourRequest = {
    "jsonrpc": "2.0",
    "method": "training",
    "params": {
        "_auth": EPOC.TOKEN,
        "detection": "mentalCommand",
        "session": EPOC.SESSION,
        "action": "push",
        "status": "start"
    },
    "id": 1
}

EPOC.toCortexAPI(YourRequest);

```

Here, too, I would be happy if volunteers would continue to work on the project and implement additional functions ❤️

### Socket
If you want to use this information outside the NodeJS server, such as a website or app, you can simply use Brainfuck together with Socket.io.

``` javascript
const BrainFuck = require("../../libs/brainfuck");
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(80);

const EPOC = new BrainFuck('INSERT_YOUR_HEADSET_ID');

let client_id = 'INSERT_YOUR_CLIENT_ID';
let client_secret = 'INSERT_YOUR_CLIENT_SECRET';

// 01. CONNECT
EPOC.Connect(client_id, client_secret);

// 02. INITIALIZE
EPOC.on('Ready', () => {
    console.log('READY!');
    EPOC.loadProfile('INSERT_YOUR_PROFILE_NAME');
    EPOC.startStream();
});

// 03. DATA STREAM
EPOC.on('Stream', (data) =>{

    // DO THINGS WITH COMMANDS AND FACE-ACTIONS...
    console.log(`command: ${ data.command } | eyeAction: ${ data.eyeAction } | upperFaceAction: ${ data.upperFaceAction } | lowerFaceAction: ${ data.lowerFaceAction } `)
    
    // Send to Socket
    io.emit('BRAINSTREAM', data);
})

io.on('connection', function(socket){
    console.log('a user connected');
});
  
```

In the website/app you can then simply receive and use the data:
```javascript
let BRAIN;
socket.on('BRAINSTREAM', (data) => {
    BRAIN = data;
})
```

You can find an example under ```src/examples```. Here you can control a small red ball with thoughts in a website. But you have to train a profile with the EmotivBCI App that can recognize Push, Pull, Left and Right.

# Todos
- [ ] Clean up and adjust code
- [ ] Start In-Application Training with Brainfuck
- [ ] More Examples

I accept pull requests ;)



