# BrainFuck 🧠
BrainFuck is a small framework to quickly and easily write small BCI prototypes for the Emotiv EPOC+.

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

[!!!!IMAGE OF QUALITY!!!!]

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

# Brainfuck
I created this framework as part of a free elective with Prof. Dr.-Ing. Martin Leissler in order to make it easier for future students to get started with BCI using the Emotiv EPOC.

This framework allows easy communication with the CortexAPI:<br />
[https://emotiv.github.io/cortex-docs/#introduction](https://emotiv.github.io/cortex-docs/#introduction)

The framework is available in a NodeJS and a Unity version.

