//Test Test
let orgDiameter = 4;
let organisms = [];
let reproduceRange = 100;
let xCanvas = 300;
//with #myCanvas width = 1024px
let yCanvas = 150;
//with #myCanvas height = 526px
let startingPlants = 10;
let drawInterval;
let predateInterval;
let dieInterval;
let reproduceInterval;
let evolutionRate = .01;
let count = 0;

let canvas;
let context;

function Organism(xPos, yPos, levelP, birthDistance, maxChildP){
    this.x = xPos;
    this.y = yPos;
    this.level = levelP
    this.diameter = orgDiameter;
    this.timeAlive = 0;
    this.lifeSpan = 10;
    this.birthDistance = birthDistance;
    this.numChild = 0;
    this.maxChild = maxChildP;
}

function setup() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    for(let i = 0; i < startingPlants; i++){
        let org = new Organism(Math.random()*xCanvas, Math.random()*yCanvas, 0, Math.random()*20 + 20, Math.random()*2 + 1)
        organisms.push(org);
    }
    clearIntervals();
    setIntervals();
}

function setIntervals(){
    predateInterval = setInterval(predate, 499);
    drawInterval = setInterval(draw,5000);
}
function clearIntervals(){
    clearInterval(drawInterval);
}

function draw() {
    die();
    predate();
    count++;
    console.log(count + "-----------------------------")
    context.clearRect(0,0, canvas.width, canvas.height);
    for(let i = 0; i < organisms.length; i++){
        let org = organisms[i];
        context.beginPath();
        context.ellipse(org.x,org.y,orgDiameter,orgDiameter,0,0,2 * Math.PI);
        if(org.level === 0){
            context.fillStyle = "green";
        }
        if(org.level === 1){
            context.fillStyle = "yellow";
        }
        context.fill();
    }
    reproduce();
}


function reproduce(){
    let temp = [];
    let horny = [];
    for(let i = 0; i < organisms.length; i++){
        let org = organisms[i];
        horny.push(org);
    }
    for(let i = 0; i < organisms.length-1; i++){
        let org1 = organisms[i];
        if(horny.includes(org1)){
            for(let j = i+1; j < organisms.length; j++){
                let org2 = organisms[j];
                if(org1.level === org2.level && horny.includes(org2) && inRange(org1,org2,reproduceRange)){
                    let b = average(org1.birthDistance, org2.birthDistance);
                    let xPos = average(org1.x,org2.x) + Math.random()*b - b/2;
                    let yPos = average(org1.y, org2.y) + Math.random()*b - b/2;
                    let rand = Math.random();
                    let birthDistance = b + Math.random()*10 - 5;
                    //console.log(birthDistance);
                    let birthDistanceSum = 0;
                    let maxChildSum = 0;
                    for(let k = 0; k < organisms.length; k++){
                        birthDistanceSum += organisms[k].birthDistance;
                        maxChildSum += organisms[k].maxChild;

                    }
                    //console.log('average birth distance: ' + birthDistanceSum / organisms.length);
                    //console.log('maximum children: ' + maxChildSum / organisms.length);
                    let level;
                    if(rand > 1 - evolutionRate){
                        level = org1.level + 1;
                    }
                    else if(rand < evolutionRate && org1.level !== 0){
                        level = org1.level - 1;
                    }
                    else{
                        level = org1.level;
                    }
                    let maxChild = average(org1.maxChild, org2.maxChild) + Math.random()*2 - 1;
                    if(xPos >= orgDiameter && xPos <= xCanvas - orgDiameter && yPos >= orgDiameter && yPos <= yCanvas - orgDiameter){
                        let newOrg = new Organism(xPos, yPos, level, birthDistance, maxChild);
                        temp.push(newOrg);
                    }
                    org1.numChild ++;
                    org2.numChild ++;
                    if(org1.numChild >= org1.maxChild){
                        horny.splice(j,1);
                    }
                    if(org2.numChild >= org2.maxChild){
                        horny.splice(i,1);
                    }
                    break;
                }
            }
        }
    }
    for(let i = 0; i < temp.length; i++){
        let org = temp[i]
        organisms.push(org);
    }
}

function predate(){
    let temp = [];
    for(let i = 0; i < organisms.length; i++){
        let org1 = organisms[i];
        org1.food -= 1;
        if(org1.level !== 0){
            for(let j = 0; j < organisms.length; j++){
                let org2 = organisms[j];
                if(!temp.includes(org2) && org1.level - 1 === org2.level && inRange(org1,org2,org1.diameter + org2.diameter)){
                    temp.push(org2);
                    org1.food++;
                    console.log("Predation Death");
                }
            }
        }
    }
    for(let i = organisms.length - 1; i >= 0; i--){
        for(let j = 0; j < temp.length; j++){
            if(organisms[i] === temp[j]){
                organisms.splice(i,1);
                break;
            }
        }
    }
}

function die(){
    let temp = [];
    for(let i = 0; i < organisms.length; i++){
        let org1 = organisms[i];
        org1.timeAlive++;
        for(let j = i+1; j < organisms.length; j++) {
            let org2 = organisms[j];
            if (count > 8) {
                console.log("Shit" + org1.level === org2.level && inRange(org1, org2, average(org1.diameter, org2.diameter)))
            }
            if (org1.level === org2.level && inRange(org1, org2, average(org1.diameter, org2.diameter))) {
                temp.push(org1);
                temp.push(org2);
                console.log("Population Death");
                break;
            }
        }
        if(org1.timeAlive >= org1.lifeSpan){
            temp.push(org1);
            console.log("Natural Death");
            break;
        }
        if(org1.level > 0 && org1.food <= 0){
            temp.push(org1);
            console.log("Food Limited Death");
            break;
        }
    }
    //print(temp)
    for(let i = organisms.length - 1; i >= 0; i--){
        for(let j = 0; j < temp.length; j++){
            if(organisms[i] === temp[j]){
                organisms.splice(i,1);
                break;
            }
        }
    }
}

function pause(){
    clearIntervals();
    context.closePath();
}

function reset(){
    organisms = [];
    context.clearRect(0,0, canvas.width, canvas.height);
    context.closePath();
}


function inRange(org1, org2, distance){
    return Math.sqrt(Math.pow(org1.x - org2.x, 2) + Math.pow(org1.y - org2.y, 2)) <= distance;
}

function average(num1, num2){
    return (num1 + num2) / 2;
}