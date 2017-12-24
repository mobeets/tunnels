var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var iterCount = 0;
var nRings = 10;
var ringWidth = 3;
var ringColor;
var ringRadius = 1.2*canvasWidth;
var viewingDistance = 0.2; // viewing distance from screen
var maxDistance = 5; // initial distance from circle
var maxTime = 600; // animation length
var posStep = 1; // movement speed
var maxPosStep = 10; // maximum velocity
var ringOffsets;
var maxRingOffset = 5;

function setup() {
   var canvas = createCanvas(canvasWidth, canvasHeight);
   canvas.parent('sketch-container');
   noFill();
   textFont('Georgia');
   ringColor = color(255, 180, 0);

   ringOffsets = new Array();
   for (j = 0; j<nRings; j++) {
      append(ringOffsets, 0);
   }
}

function draw() {
   background(51);
   // iterCount = (iterCount + posStep) % posStep*1000;
   iterCount += posStep;
   drawRings();
}

function getRelativeRingTime(ringIndex) {
   iterOffset = j*(maxTime/nRings);
   t = (iterCount + iterOffset) % maxTime;
   return t;
}

function getRingDistance(t) {
   z_t = viewingDistance + ((maxTime - t)/maxTime)*(maxDistance - viewingDistance);
   return z_t;
}

function getRingRadius(z_t, r_true) {
   r_t = viewingDistance*r_true/z_t;
   return r_t;
}

function getRingCenter(ringIndex, z_t) {
   x_true_t = ringOffsets[ringIndex];
   // console.log(x_true_t);
   if (x_true_t > 0) {
      x_t = getRingRadius(z_t, x_true_t);
   } else {
      x_t = 0;
   }
   return x_t;
}

function getRingColor(t) {
   R = map(pow(t, 2), 0, pow(maxTime, 2), 255, 250);
   G = map(pow(t, 2.2), 0, pow(maxTime, 2.2), 120, 180);
   c_t = color(R, G, 0);
   return c_t;
}

function drawRing(x_t, r_t, c_t) {
   stroke(c_t);
   y_t = 0;
   arc(x_t + canvasWidth/2, y_t + canvasHeight/2,
      r_t, r_t, 0, TWO_PI);
}

function drawRings() {
   // draw circles with increasing radii
   // as if you're travelling through a tunnel
   strokeWeight(ringWidth);
   stroke(ringColor);

   for (j = 0; j<nRings; j++) {
      t = getRelativeRingTime(j);
      z_t = getRingDistance(t);
      r_t = getRingRadius(z_t, ringRadius);
      x_t = getRingCenter(j, z_t);
      c_t = getRingColor(t);
      if (j == 0) { c_t = color(128, 128, 128); }
      drawRing(x_t, r_t, c_t);
   }
}

function keyPressed() {
   if (keyCode === LEFT_ARROW) {
      ringIndex = 0;
      if (ringOffsets[ringIndex] < maxRingOffset) {
         ringOffsets[ringIndex] -= 1;
      }
      console.log(ringOffsets[ringIndex]);
   }
   if (keyCode === RIGHT_ARROW) {
      ringIndex = 0;
      if (-ringOffsets[ringIndex] < maxRingOffset) {
         ringOffsets[ringIndex] += 1;
      }
      console.log(ringOffsets[ringIndex]);
   }
   if (keyCode === UP_ARROW) {
      if (posStep < maxPosStep) { posStep += 1; }
   }
   if (keyCode === DOWN_ARROW) {
      if (posStep > 0) { posStep -= 1; }
   }
}
