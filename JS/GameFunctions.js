

var gameStatus = {
    playerCurrPosX : 11,
    playerCurrPosY : 11,
    moveX : 0,
    moveY : 0,
    playerCurrTileType: "empty",
    boxCurrTileType : "empty",
    goalArea : []
}

function drawMap(tileMap)
{
    let tableBody = document.getElementById("gameTableBody");
    for(let y = 0; y < tileMap.height; y++)
    {
        let tableRow = document.createElement("tr");
        tableBody.appendChild(tableRow);
        for(let x = 0; x < tileMap.width; x ++)
        {
            let tableCell = document.createElement("td");
            let typeOfTile = typeOfTileClass(tileMap.mapGrid[y][x][0]);
            tableCell.classList.add(typeOfTile);
            tableCell.id = "Y" + y + "X" + x;
            tableRow.appendChild(tableCell);
            if(typeOfTile === "goal")
                gameStatus.goalArea.push("Y" + y + "X" + x);
        }
    }
}

function typeOfTileClass(classType){
    switch (classType) {
        case "W":
          classType = "wall";
          break;
        case "B":
            classType = "box";
          break;
        case "G":
            classType = "goal";
          break;
        case " ":
            classType = "empty";
          break;
        case "P":
            classType = "player";
          break;
        default:
            classType = "";
      }
    return classType
}

document.addEventListener('keydown', logKey)


function logKey(e)
{
    e.preventDefault();
    DirectionOfMove(e.key);
    AttemptMove();
};


function DirectionOfMove(arrowDirection){
    switch (arrowDirection) {
        case "ArrowUp":
          gameStatus.moveY = -1;
          gameStatus.moveX = 0;
          break;
        case "ArrowDown":
            gameStatus.moveY = 1;
            gameStatus.moveX = 0;
            break;
        case "ArrowLeft":
            gameStatus.moveY = 0;
            gameStatus.moveX = -1;
            break;
        case "ArrowRight":
            gameStatus.moveY = 0;
            gameStatus.moveX = 1;
            break;
    }
}



function AttemptMove()
{
    let typeOfTileAhead = document.getElementById("Y" + (gameStatus.playerCurrPosY + gameStatus.moveY) + "X" + (gameStatus.playerCurrPosX + gameStatus.moveX)).getAttribute("class");
    
    switch (typeOfTileAhead) {
        case "wall":
          break;
        case "empty":
        case "goal":
            MovePlayer(typeOfTileAhead);
            break;
        case "box":
        case "boxInGoal":
            AttemptToPushBox();
            break;
      }
}


function AttemptToPushBox(){
    let typeOfTileAheadOfBox = document.getElementById("Y" + (gameStatus.playerCurrPosY + (2* gameStatus.moveY)) + "X" + (gameStatus.playerCurrPosX + (2 * gameStatus.moveX))).getAttribute("class");
    
    if(typeOfTileAheadOfBox === "wall" || typeOfTileAheadOfBox === "boxInGoal" || typeOfTileAheadOfBox === "box")
        return;
 
    MoveBox(typeOfTileAheadOfBox);
    let typeOfTileAheadOfPlayer = document.getElementById("Y" + (gameStatus.playerCurrPosY + gameStatus.moveY) + "X" + (gameStatus.playerCurrPosX + gameStatus.moveX)).getAttribute("class");
    MovePlayer(typeOfTileAheadOfPlayer);
    CheckIfGameIsFinished();
}


function MovePlayer(typeOfTileAheadOfPlayer){
    let tableCellToMoveFrom = document.getElementById("Y" + gameStatus.playerCurrPosY + "X" + gameStatus.playerCurrPosX);
    let tableCellToMoveTo = document.getElementById("Y" + (gameStatus.playerCurrPosY += gameStatus.moveY) + "X" + (gameStatus.playerCurrPosX += gameStatus.moveX));
    tableCellToMoveFrom.className = gameStatus.playerCurrTileType;
    tableCellToMoveTo.className = "player";
    gameStatus.playerCurrTileType = typeOfTileAheadOfPlayer;
}

function MoveBox(typeOfTileAheadOfBox){
    if(TileIsGoalArea(gameStatus.playerCurrPosY + gameStatus.moveY, gameStatus.playerCurrPosX + gameStatus.moveX))
        gameStatus.boxCurrTileType = "goal";
    else
        gameStatus.boxCurrTileType = "empty";

    let tableCellToMoveFrom = document.getElementById("Y" + (gameStatus.playerCurrPosY + gameStatus.moveY) + "X" + (gameStatus.playerCurrPosX + gameStatus.moveX));
    let tableCellToMoveTo = document.getElementById("Y" + (gameStatus.playerCurrPosY + (2 * gameStatus.moveY)) + "X" + (gameStatus.playerCurrPosX + (2 * gameStatus.moveX)));
    tableCellToMoveFrom.className = gameStatus.boxCurrTileType;
    tableCellToMoveTo.className = TileIsGoalArea((gameStatus.playerCurrPosY + (2 * gameStatus.moveY)), (gameStatus.playerCurrPosX + (2 * gameStatus.moveX))) ? "boxInGoal" : "box";
    gameStatus.boxCurrTileType = typeOfTileAheadOfBox;
}


function TileIsGoalArea(elDesY, elDesX){
    if(tileMap01.mapGrid[elDesY][elDesX][0]  === "G")
    {
        return true;
    }
    return false;
}

function CheckIfGameIsFinished(){
    gameIsFinished = true;
    for (let index = 0; index < gameStatus.goalArea.length; index++) {
        let goalAreaTableCell = document.getElementById(gameStatus.goalArea[index]);
        if(goalAreaTableCell.className !== "boxInGoal")
            gameIsFinished = false;
    }

    if(gameIsFinished)
        alert("GAME WON!");
}

drawMap(tileMap01);