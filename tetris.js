/* ===== FULL TETRIS ===== */

const canvas=document.getElementById("tetris");
const ctx=canvas.getContext("2d");
const grid=20;

const arena=Array.from({length:20},()=>Array(12).fill(0));

const pieces={
I:[[1,1,1,1]],
O:[[1,1],[1,1]],
T:[[0,1,0],[1,1,1]],
L:[[1,0,0],[1,1,1]],
J:[[0,0,1],[1,1,1]],
S:[[0,1,1],[1,1,0]],
Z:[[1,1,0],[0,1,1]]
};

function createPiece(){
const keys=Object.keys(pieces);
return pieces[keys[Math.floor(Math.random()*keys.length)]];
}

const player={
pos:{x:4,y:0},
matrix:createPiece()
};

function collide(arena,player){
return player.matrix.some((row,y)=>
row.some((v,x)=>v&&(arena[y+player.pos.y]?.[x+player.pos.x]!==0))
);
}

function merge(arena,player){
player.matrix.forEach((row,y)=>
row.forEach((v,x)=>{
if(v) arena[y+player.pos.y][x+player.pos.x]=1;
}));
}

function rotate(matrix){
return matrix[0].map((_,i)=>matrix.map(row=>row[i]).reverse());
}

function arenaSweep(){
outer:for(let y=arena.length-1;y>=0;y--){
for(let x=0;x<arena[y].length;x++)
if(arena[y][x]===0) continue outer;

arena.splice(y,1);
arena.unshift(Array(12).fill(0));
y++;
}
}

function playerDrop(){
player.pos.y++;
if(collide(arena,player)){
player.pos.y--;
merge(arena,player);
arenaSweep();
player.matrix=createPiece();
player.pos={x:4,y:0};
}
draw();
}

function drawMatrix(matrix,offset,color){
matrix.forEach((row,y)=>
row.forEach((v,x)=>{
if(v){
ctx.fillStyle=color;
ctx.fillRect((x+offset.x)*grid,(y+offset.y)*grid,grid,grid);
}
}));
}

function draw(){
ctx.fillStyle="black";
ctx.fillRect(0,0,canvas.width,canvas.height);
drawMatrix(arena,{x:0,y:0},"cyan");
drawMatrix(player.matrix,player.pos,"red");
}

let dropCounter=0;
let dropInterval=600;
let lastTime=0;

function update(time=0){
const delta=time-lastTime;
lastTime=time;
dropCounter+=delta;

if(dropCounter>dropInterval){
playerDrop();
dropCounter=0;
}
draw();
requestAnimationFrame(update);
}
update();

document.addEventListener("keydown",e=>{
if(e.key==="ArrowLeft"){
player.pos.x--;
if(collide(arena,player)) player.pos.x++;
}
if(e.key==="ArrowRight"){
player.pos.x++;
if(collide(arena,player)) player.pos.x--;
}
if(e.key==="ArrowDown") playerDrop();
if(e.key==="ArrowUp"){
const rotated=rotate(player.matrix);
const prev=player.matrix;
player.matrix=rotated;
if(collide(arena,player)) player.matrix=prev;
}
draw();
});