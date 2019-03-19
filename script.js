/**
 *
 * author: jancentrih
 * https://github.com/jancentrih
 *
 */
var zoge = [];
var velocity = 1;
var r = 15;
var canvas;
var context;
var numzoge = 5;
var reset = false;
var risi = true;

class zoga{
    constructor(){
        this.x = Math.floor(Math.random() * (1020 - 2*r)) + r;
        this.y = Math.floor(Math.random() * (800- 2*r)) + r;
        this.smer = Math.floor(Math.random() * 360);
        this.velocityx = velocity;
        this.velocityy = velocity;
        this.collision = false;
    }
}

function clearColl() {
    for(var v=0;v<zoge.length;v++){
        zoge[v].collision = false;
    }
}

function risiZoge() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearColl();
    var risix = document.getElementById("quadcheck");
    if(risix.checked == true){
        risi = true;
    }else{
        risi = false;
    }
    var tmp = quadTreeCollision(0, 0, canvas.width, canvas.height, zoge, risi);
    
    var l = zoge.length;
    for(var j=0;j<l;j++){
        var x = zoge[j].x - Math.sin(degRad(zoge[j].smer)) * zoge[j].velocityx * velocity;
        var y = zoge[j].y - Math.cos(degRad(zoge[j].smer)) * zoge[j].velocityy * velocity;
        
        if(x+r > 1020 || x-r < 0){
            zoge[j].velocityx = zoge[j].velocityx * -1;
        }
        
        if(y+r > 800 || y-r < 0){
            zoge[j].velocityy = zoge[j].velocityy * -1;
        }
        
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI, false);
        
        context.lineWidth = 1;
        context.strokeStyle = '#000000';
        context.stroke();
        
        zoge[j].x = x;
        zoge[j].y = y;
        
    }
}

function quadTreeCollision(x1, y1, x2, y2, array, risi) {
    var len = array.length;
    var tmp = [];
    var rez = [];
    for (var m = 0;m<len;m++){
        if(array[m].x < x2 && array[m].x > x1 && array[m].y < y2 && array[m].y > y1){
            tmp.push(array[m]);
        }
    }
    var numq = tmp.length;
        
    if(numq > 6){
        var xx = (x2-x1)/2;
        var yy = (y2-y1)/2;
        
        if(risi){
            //navpicna crta
            context.beginPath();
            context.moveTo(x1+xx, y1);
            context.lineTo(x1+xx, y1 + (2*yy));
            context.stroke();

            //vodoravna crta
            context.beginPath();
            context.moveTo(x1, y1+yy);
            context.lineTo(x1 + (2*xx), y1+yy);
            context.stroke();
        }
        
        //recursive calls
        var tm1 = quadTreeCollision(x1, y1, (x1+xx), (y1+yy), tmp, risi); //top left
        var tm2 = quadTreeCollision((x1+xx), y1, (x1+(2*xx)), (y1+yy), tmp, risi); //top right
        var tm3 = quadTreeCollision(x1, (y1+yy), (x1+xx), (y1+(2*yy)), tmp, risi); //bottom left
        var tm4 = quadTreeCollision((x1+xx), (y1+yy), x2, y2, tmp, risi); //bottom right
        
        rez = rez.concat(tm1);
        rez = rez.concat(tm2);
        rez = rez.concat(tm3);
        rez = rez.concat(tm4);
    }else{
        rez = collisionDetection(tmp);
    }
    return rez;
}

function collisionDetection(array) {
    var l = array.length;
    
    for (var ii = 0;ii<l;ii++){
            var pos1x = array[ii].x;
            var pos1y = array[ii].y;
        for (var jj =0;jj<l;jj++){
            if(jj!=ii){
                var pos2x = array[jj].x;
                var pos2y = array[jj].y;
                
                if(collision(pos1x, pos1y, pos2x, pos2y)){
                    context.beginPath();
                    context.arc(pos1x, pos1y, r, 0, 2 * Math.PI, false);
                    context.fillStyle = 'red';
                    context.fill();
                }
            }
        }
    }
    return array;
}

function collision(x1, y1, x2, y2) {
    if(Math.sqrt((x2 - x1)**2 + (y2 - y1)**2) <= (r+r+2)){
        return true;
    }else{
        return false;
    }
}

function checkNum() {
    var z = document.getElementById("stzog");
    var x = z.options[z.selectedIndex].value;
    
    if(x != numzoge){
        reset = true;
        numzoge = x;
    }else{
        reset = false;
    }
}

function restart() {
    console.log("restart");
    context.clearRect(0, 0, canvas.width, canvas.height);
    zoge = [];
    start();
}

function start() {
    canvas = document.getElementById('maincanvas');
    context = canvas.getContext('2d');
    var z = document.getElementById("stzog");
    numzoge = z.options[z.selectedIndex].value;
    
    
    for(var i=0;i<numzoge;i=i+1){
        zoge[i] = new zoga();
        zoge[i].oid = i;
    }
    
    var interval = setInterval(function(){
        //collisionDetection
        risiZoge();
        checkNum();
        if(reset == true){
            clearInterval(interval);
            restart();
        }
    }, 15);
}

function degRad(degree){
    return degree * Math.PI / 180;
}