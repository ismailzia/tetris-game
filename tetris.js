const cvs = document.getElementById('tetris');
const ctx = cvs.getContext ("2d");

const ROW = 20;
const COL = 10;
const SQ = squareSize = 20;
const VACANT = 'white'; //color of an empty square

//draw a square
function drawSqaure(x, y, color){
    ctx.fillStyle = color
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ)
    ctx.strokeStyle = "black"
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ)
}

//create the board
let board = []
for(r=0 ; r<ROW ; r++){
    board[r] = []
    for(c=0 ; c<COL ; c++){
        board[r][c] = VACANT
    }
}

function drawBoard(){
    for(r=0 ; r<ROW ; r++){
        for(c=0 ; c<COL ; c++){
            drawSqaure(c, r, board[r][c])
        }
    }
}
drawBoard();

//the pieces and thiere colors 
const PIECES = [
    [Z,"red"],
    [I,"blue"],
    [J,"green"],
    [O,"yellow"],
    [L,"purplr"],
    [T,"orange"],
    [S,"cyan"]
];

//generate random pieaces*
function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // return => 1-> 6 
    return new Piece(PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();

//The object piece
function Piece(tetromino, color){
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;// we start with the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN]

    //we need to control the pieces 
    this.x = 3;
    this.y = 0;
}

//fill 
Piece.prototype.fill = function(color){
    for( r=0 ; r<this.activeTetromino.length ; r++){
        for( c=0 ; c<this.activeTetromino.length ; c++){
            //we draw only occupied squares
            if(this.activeTetromino[r][c]){
                drawSqaure(this.x + c , this.y + r , color);
            }
        }
    }
}

//drow a piece to the board 
Piece.prototype.draw = function(){
    this.fill(this.color)
}

//drow a piece to the board 
Piece.prototype.undraw = function(){
   this.fill(VACANT)
}

//Move down the piece
Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.undraw()
        this.y++;
        this.draw()
    }else{
        //lock the piece and generate a new piece
       this.lock()
        p = randomPiece();

    }
}

//Move right the piece
Piece.prototype.moveRight = function(){
   if(!this.collision(1,0,this.activeTetromino)){
        this.undraw()
        this.x++;
        this.draw()
    }
}

//Move left the piece
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.undraw()
        this.x--;
        this.draw()
    }
}

//Move retate the piece
Piece.prototype.retate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;

    if(!this.collision(0,0,nextPattern)){    
        if(this.x > COL/2){
            //it's the right wall
            kick = -1 // we need to move the piece to the left  
        }else{
            //it's the left wall
            kick = 1 // we need to move the piece to the right  
        }
    }

    if(!this.collision(0,0,nextPattern)){
        this.undraw()
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length //(0+1)%4 =>1
        this.activeTetromino = this.tetromino[this.tetrominoN]
        this.draw() 
    }
}

//function lock
Piece.prototype.lock = function(){
    for( r=0 ; r<this.activeTetromino.length ; r++){
        for( c=0 ; c<this.activeTetromino.length ; c++){
            //we skip the vacant squares
            if(!this.activeTetromino[r][c]){
                continue;
            }
            //pieces to lock on top = game over
            if(this.y+r < 0){
                alert("Game Over");
                //stop request animation frame
                gameOver = true;
                break;
            }
            //we lock the piece
            board[this.y+r][this.x+c] = this.color
        }
    }
}

//collision function
Piece.prototype.collision = function(x, y, piece){
    for( r=0 ; r<this.activeTetromino.length ; r++){
        for( c=0 ; c<this.activeTetromino.length ; c++){
            //if the square is empty
            if(!piece[r][c]){
                continue
            }
            //cordinate of pieace after move 
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            //conditions
            if(newX < 0 || newX >= COL || newY >= ROW ){
                return true;
            }
            //skip newy <0; board[-1] will crush our game 
            if(newY < 0){
                continue;
            }
            //checked if there is a locked piece already in place 
            if(board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false ;
}

document.addEventListener('keydown', control);
function control(event){

    if(event.keyCode == 37){
        p.moveLeft()
        dropStart = Date.now()
    }else if(event.keyCode == 38){
        p.retate()
        dropStart = Date.now()
    }else if(event.keyCode == 39){
        p.moveRight()
        dropStart = Date.now()
    }else if(event.keyCode == 40){
        p.moveDown()
    }
}

//drop the piece every 1 second
let dropStart = Date.now()
let gameOver = false;
function drop(){
    let now = Date.now();
    let alpha = now - dropStart;
    if(alpha > 1000){
        p.moveDown();
        dropStart = Date.now()
    }
    if(!gameOver){
        requestAnimationFrame(drop);
    }
}
drop()
