var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var iterCount = 0;
var nRings = 30;
var ringWidth = 3; // stroke width for each ring
var ringColor;
var ringRadius = 1.2*canvasWidth; // max ring radius
var viewingDistance = 0.2; // viewing distance from screen
var maxDistance = 50; // initial distance from circle
var maxTime = 600; // animation length
var iterStep = 1; // movement speed
var maxPosStep = 10; // maximum velocity
var ringOffsets; // horizontal offset of each ring
var maxRingOffset = 10;
var curRingIndex = nRings-1; // index of most distant ring

var hOffAmp = 50;
var vOffAmp = 50;
var vOffPer = 0.5;
var hOffPer = 0.5;

function setup() {
   var canvas = createCanvas(canvasWidth, canvasHeight);
   canvas.parent('sketch-container');
   noFill();
   textFont('Georgia');
   ringColor = color(255, 180, 0);

   // init offsets to zero
   ringOffsets = new Array();
   for (j = 0; j<nRings; j++) {
      append(ringOffsets, 0);
   }
}

function draw() {
   background(51);
   iterCount += iterStep;
   drawRings();
}

function getRelativeRingTime(ringIndex) {
   iterOffset = j*(maxTime/nRings);
   return (iterCount + iterOffset) % maxTime;
}

function getRingDistance(t) {
   return viewingDistance + ((maxTime - t)/maxTime)*(maxDistance - viewingDistance);
}

function getRingRadius(z_t, r_true) {
   return viewingDistance*r_true/z_t;
}

function getRingHorizOffset(ringIndex, t, z_t) {
   return hOffAmp*sin(TWO_PI*t/(hOffPer*maxTime));

   x_true_t = ringOffsets[ringIndex];
   if (x_true_t > 0) {
      return 30*getRingRadius(z_t, x_true_t);
   } else {
      return 0;
   }
}

function getRingVertOffset(ringIndex, t, z_t) {
   return vOffAmp*cos(TWO_PI*t/(vOffPer*maxTime));

   x_true_t = ringOffsets[ringIndex];
   if (x_true_t > 0) {
      return 30*getRingRadius(z_t, x_true_t);
   } else {
      return 0;
   }
}

function getRingColor(t) {
   R = map(pow(t, 2), 0, pow(maxTime, 2), 255, 250);
   G = map(pow(t, 2.2), 0, pow(maxTime, 2.2), 120, 180);
   return color(R, G, 0);
}

function drawRing(x_t, y_t, r_t, c_t) {
   stroke(c_t);
   arc(x_t + canvasWidth/2, y_t + canvasHeight/2,
      r_t, r_t, 0, TWO_PI);
}

function drawRings() {
   // draw circles with increasing radii
   // as if you're travelling through a tunnel
   strokeWeight(ringWidth);
   stroke(ringColor);

   highestT = nRings;
   for (j = 0; j<nRings; j++) {
      t = getRelativeRingTime(j);
      if (t < highestT) {
         curRingIndex = j;
         highestT = t;
      }
      z_t = getRingDistance(t);
      r_t = getRingRadius(z_t, ringRadius);
      x_t = getRingHorizOffset(j, t, z_t);
      y_t = getRingVertOffset(j, t, z_t);
      c_t = getRingColor(t);
      drawRing(x_t, y_t, r_t, c_t);
   }
}

function keyPressed() {
   if (keyCode === LEFT_ARROW) {
      // vOffAmp += 5;
      // hOffAmp += 5;
      vOffPer += 0.5;
      hOffPer += 0.5;
      if (-ringOffsets[curRingIndex] < maxRingOffset) {
         ringOffsets[curRingIndex] -= 1;
      }
   }
   if (keyCode === RIGHT_ARROW) {
      // vOffAmp -= 5;
      // hOffAmp -= 5;
      vOffPer -= 0.5;
      hOffPer -= 0.5;
      if (ringOffsets[curRingIndex] < maxRingOffset) {
         ringOffsets[curRingIndex] += 1;
      }
   }
   if (keyCode === UP_ARROW) {
      if (iterStep < maxPosStep) { iterStep += 1/2; }
   }
   if (keyCode === DOWN_ARROW) {
      if (iterStep > 0) { iterStep -= 1/2; }
   }
}
