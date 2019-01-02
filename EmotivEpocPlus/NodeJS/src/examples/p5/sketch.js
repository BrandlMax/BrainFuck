// SOCKET
let socket = io('http://localhost:80');
let BRAIN = null;
socket.on('BRAINSTREAM', (data) => {
    BRAIN = data;
})


let Ball;
function setup(){
    createCanvas(window.innerWidth, window.innerHeight);

    Ball = new Mover(3, width/2, height/2)
}

function draw(){
    console.log(BRAIN);

    background(255);
    noStroke()
    fill('red')

    if(BRAIN != null){
        
        var movement = createVector(0, 0);

        if(BRAIN.command == 'neutral'){
            Ball.velocity.y *= -0.9;
            Ball.velocity.x *= -0.9;
        }
        if(BRAIN.command == 'push'){
            var movement = createVector(0, -0.5);
        }
        if(BRAIN.command == 'pull'){
            var movement = createVector(0, 0.5);
        }
        if(BRAIN.command == 'left'){
            var movement = createVector(-0.5, 0);
        }
        if(BRAIN.command == 'right'){
            var movement = createVector(0.5, 0);
        }

        // Apply Force
        Ball.applyForce(movement);
        Ball.update();
        Ball.display();
        Ball.checkEdges();
    }
}

function windowResized(){
    resizeCanvas(window.innerWidth, window.innerHeight)
}


// MOVER FROM P5 -> Thanks to CODING TRAIN
function Mover(m,x,y) {
    this.mass = m;
    this.position = createVector(x,y);
    this.velocity = createVector(0,0);
    this.acceleration = createVector(0,0);
  }
  
  // Newton's 2nd law: F = M * A
  // or A = F / M
  Mover.prototype.applyForce = function(force) {
    var f = p5.Vector.div(force,this.mass);
    this.acceleration.add(f);
  };
    
  Mover.prototype.update = function() {
    // Velocity changes according to acceleration
    this.velocity.add(this.acceleration);
    // position changes by velocity
    this.position.add(this.velocity);
    // We must clear acceleration each frame
    this.acceleration.mult(0);
  };
  
  Mover.prototype.display = function() {
    noStroke();
    fill('red');
    ellipse(this.position.x,this.position.y,this.mass*16,this.mass*16);
  };
  
  // Bounce off bottom of window
  Mover.prototype.checkEdges = function() {
    if (this.position.y > (height - this.mass*8)) {
      this.velocity.y = 0;
      this.position.y = (height - this.mass*8);
    }
    if (this.position.y < (0 + this.mass*8)) {
        this.velocity.y = 0;
        this.position.y = (0 + this.mass*8);
    }
    if (this.position.x > (width - this.mass*8)) {
        this.velocity.x = 0;
        this.position.x = (width - this.mass*8);
    }
    if (this.position.x < (0 + this.mass*8)) {
        this.velocity.x = 0;
        this.position.x = (0 + this.mass*8);
    }
  };