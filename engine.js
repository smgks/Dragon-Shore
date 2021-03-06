//TODO: вынести Scene, SceneObject и State в отдельный файл
//TODO: всё, что связано с текстурами и тайлами -- тоже

let game = null;//new GameState();
let menu = null;
let credits = null;
let leaderboards = null; //TODO
let settings = null; //TODO
let gameOver = null;//new GameOverState();
let charCreation = null;
let depth;

class Scene {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.state = null;
        this.eventList = {};
        this.ctx.imageSmoothingEnabled = false;
    }
    setState(state) {
        //remove old handlers
        for (let oldEvent in this.eventList) {
            console.log("Remove old handlers", oldEvent, this.eventList[oldEvent]);
            if (this.eventList.hasOwnProperty(oldEvent) && this.eventList[oldEvent] !== null) {
                window.removeEventListener(oldEvent, this.eventList[oldEvent]);
            }
        }
        this.eventList = {};
        //and set new
        this.state = state;
        let events = this.state.events;
        for (let event in events) {
            console.log("Add new handlers", event, events[event]);
            if (events.hasOwnProperty(event) && events[event] !== null) {
                this.eventList[event] = e => {
                    events[event].call(this.state, this, e);
                };
                window.addEventListener(event, this.eventList[event]);
            }
        }
    }
    getState() {
        return this.state;
    }
    update() {
        this.state.update(this.ctx);
    }
}

class State {
    constructor(){}
    get events() {
        return {};
    }
    update(context){

    }
}

class CreditsState extends State {
    constructor() {
        super();
    }
    keyHandler(scene, event) {
        scene.setState(menu);
        scene.update();
    }
    get events() {
        return {
            keyup: this.keyHandler,
        }
    }
    update(context){
        context.clearRect(0, 0, 960, 600);
        context.fillStyle = "white";
        context.font = "48px manaspc";
        context.textAlign = "center";
        context.fillText("Credits", 470, 40);
        context.font = "36px manaspc";
        context.fillText("Press any key to continue...", 470, 580);

        context.textAlign = "left";
        context.font = "24px manaspc";

        context.fillText("Made by:", 10, 65);
        context.fillText("Balashenko Igor (DwarfMason)", 10, 100);
        context.fillText("Yury Kurlykov (t1meshift)", 10, 130);
        context.fillText("Andrey Osadchii (smgks)", 10, 160);
        super.update(context);
    }
}

class GameOver extends State{
    constructor(){
        super();

    }
    keyHandler(scene, event) {
        switch(event.keyCode) {

            case 13:
                scene.setState(menu);
                menu.dropMenuPos();

        }
        scene.update();
    }
    get events() {
        return {
            keyup: this.keyHandler,
        }
    }
    update(context){
        context.drawImage(gameOverImg, 0, 0);

        context.fillStyle = "white";
        context.font  = "24px manaspc";

        context.fillText(`Name: ${mainHero.name}`, 20, 150);
        context.fillText(`Race: ${mainHero.race}`, 20, 180);
        context.fillText(`Depth: ${depth}`, 20, 210);
        context.fillText(`Weapon: ${mainHero.weapon.name}`, 20, 240);
        context.fillText(`Armor: ${mainHero.armor.name}`, 20, 270);
        context.fillText("Press Enter to exit...", 100, 600);
        super.update(context);
    }
}

class MenuState extends State {
    constructor() {
        super();
        this.menuPos = 0;
        this.menuImgs = menuImgs;
    }
    dropMenuPos(){
        this.menuPos=0;
    }
    keyHandler(scene, event) {
        switch(event.keyCode) {
            case 38: //arrow up
                this.menuPos--;
                break;
            case 40: //arrow down
                this.menuPos++;
                break;
            case 13:
                switch (this.menuPos){
                    case 0:
                        scene.setState(charCreation);
                        // scene.setState(game);
                        // game.startGame();
                        break;
                    case 1:
                        alert("Not yet implemented!");
                        break;
                    case 2:
                        alert("Not yet implemented!");
                        break;
                    case 3:
                        scene.setState(credits);
                        break;
                    default:
                        alert("Not yet implemented!");
                        break;
                }
        }
        scene.update();
    }
    get events() {
        return {
            keyup: this.keyHandler,
        }
    }
    update(context){
        context.fillStyle = "black";
        context.fillRect(0, 0, 1000, 650);

        if (this.menuPos < 0)
            this.menuPos = 3;
        if (this.menuPos > 3)
            this.menuPos = 0;

        context.drawImage(this.menuImgs[this.menuPos], 0, 0);
        super.update(context);
    }
}

class CharCreationState extends State {
    constructor() {
        super();
        this.isCreated = false;
    }
    keyHandler(scene, event) {
        switch (event.keyCode) {
            case 72: //h
                mainHero = new Player('human', 10, 10, 'brave hero');
                this.isCreated = true;
                break;
            case 79: //o
                mainHero = new Player('orc', 10, 10, 'badass orc');
                this.isCreated = true;
                break;
            case 77: //m
                mainHero = new Player('magic wombat', 10, 10, 'little cuty');
                this.isCreated = true;
                break;
            case 13: //Enter
                if (this.isCreated) {
                    this.isCreated = false;
                    scene.setState(game);
                    game.startGame();
                }
        }
        scene.update();
    }

    get events() {
        return {
            keyup: this.keyHandler,
        }
    }

    update(context) {
        context.clearRect(0, 0, 960, 600);
        context.fillStyle = "white";
        context.font = "48px manaspc";
        context.textAlign = "center";
        context.fillText("Choose your race:", 470, 40);
        context.font = "24px manaspc";
        context.fillText("Press the following button to choose your hero", 470, 580);
        context.fillText("Press Enter to play", 470, 600);

        context.textAlign = "left";
        context.font = "24px manaspc";

        context.fillText("h - human", 10, 100);
        context.fillText("o - orc", 10, 130);
        context.fillText("m - magic wombat", 10, 160);
        super.update(context);
        if (this.isCreated) {
            context.font = "16px manaspc";
            context.fillText(`Your character: ${mainHero.name}`, 650, 100);
            context.fillText(`Strength: ${mainHero.strength}`, 650,130);
            context.fillText(`Agility: ${mainHero.agility}`, 650,160);
            context.fillText(`Initiative: ${mainHero.initiative} `, 650,190);
            context.fillText(`Endurance: ${mainHero.endurance}`, 650,220);
        }
    }
}


class GameState extends State {
    constructor(dialog = 0) {
        super();
        this.offsetX = 0;
        this.offsetY = 0;
        this.map = [[]];
        this.objectsMap = [];
        this.messages = ["","","","","","","","",""];
//        this.rMenu = null;
        this.controller = null;
        this.ctx = null;
        this.fieldHeight = 30;
        this.fieldWidth  = 50;
        this.centerY = (this.fieldHeight/2)>>0;
        this.centerX = (this.fieldWidth/2)>>0;
        this.centerRectH = 11;
        this.centerRectW = 17;
    }
    startGame(){
        depth = 1;
        let cave = dungeonGeneration.generateCave(depth);
        this.map = cave[0];
        this.objectsMap = dungeonGeneration.generateObjects();
//        this.rMenu = this.objectsMap[0].rMenu;
        this.messages = ["","","","","","","","",""];
        this.objectsMap[0].x = cave[1];
        this.objectsMap[0].y = cave[2];
        this.controller = new controller(this.objectsMap[0],this.map,this.objectsMap);

        //calculate offset
        //TODO testing
        let player = this.objectsMap[0];

        this.offsetX = player.x - this.centerX;
        this.offsetY = player.y - this.centerY;
        this.checkOffsetBorders();

        this.pushMessage("game started");
    }

    checkOffsetBorders() {
        //checking borders
        let mapW = this.map[0].length;
        let mapH = this.map.length;

        if (this.offsetX + this.fieldWidth-1 >= mapW) {
            this.offsetX = mapW - this.fieldWidth - 2;
        }
        if (this.offsetX < 0) {
            this.offsetX = 0;
        }

        if (this.offsetY + this.fieldHeight-1 >= mapH) {
            this.offsetY = mapH - this.fieldHeight - 2;
        }
        if (this.offsetY < 0) {
            this.offsetY = 0;
        }
    }

    calcOffset() {
        if (!this.objectsMap) {
            alert("Something wrong happened, please reload the page");
            return;
        }
        let player = this.objectsMap[0];
        if (!player) {
            // TODO game over?
        }
        // Calculating map offsets
        /*
        If the player is near to a map border, then no scrolling of course
        If the player is in "center rectangle", then offset won't change
        If the player is out of "center rectangle", then change offset
        */

        let centerRectX = this.offsetX + ((this.fieldWidth - this.centerRectW) / 2) >> 0;
        let centerRectY = this.offsetY + ((this.fieldHeight - this.centerRectH) / 2) >> 0;
        let mapW = this.map[0].length;
        let mapH = this.map.length;

        if (player.x < centerRectX) {
            if (this.offsetX > 0) {
                this.offsetX--;
            }
        }
        if (player.x >= centerRectX + this.centerRectW) {
            if (this.offsetX + this.fieldWidth < mapW) {
                this.offsetX++;
            }
        }

        if (player.y < centerRectY) {
            if (this.offsetY > 0) {
                this.offsetY--;
            }
        }
        if (player.y >= centerRectY + this.centerRectH) {
            if (this.offsetY + this.fieldHeight < mapH) {
                this.offsetY++;
            }
        }
        this.checkOffsetBorders();
    }

    setNewMap(){
        this.map = dungeonGeneration.generateCave();
        this.objectsMap = dungeonGeneration.generateObjects();
    }
    pushMessage(text){
        this.messages[7] = this.messages[6];
        this.messages[6] = this.messages[5];
        this.messages[5] = this.messages[4];
        this.messages[4] = this.messages[3];
        this.messages[3] = this.messages[2];
        this.messages[2] = this.messages[1];
        this.messages[1] = this.messages[0];

        this.messages[0] = text;
        if(this.ctx !== null){this.update(this.ctx);}

        //alert(this.messages);
    }


    drawRMenu(context){
        context.fillStyle = "black";
        context.fillRect(0, 0, 1000, 650);
        context.fillStyle = 'white';
        context.fillRect(805,5,190,475);
        context.fillStyle = "black";
        context.fillRect(807,7,186,471);

        context.fillStyle = "white";
        context.font  = "24px manaspc";
        if(this.objectsMap[0] !== undefined){
            context.fillText(this.objectsMap[0].name, 815, 35);
            context.fillText("HP:" + this.objectsMap[0].hp + '/' + this.objectsMap[0].maxHP ,820,70);
            context.fillText("MP:" + this.objectsMap[0].mp + '/' + this.objectsMap[0].maxMP ,820,100);
            context.fillText(`Gold:${this.objectsMap[0].gold}`,820,130);
            context.font  = "12px manaspc";

                context.fillText("-status:", 820, 150);
            for (let i = 0; i < this.objectsMap[0].baffs.length; ++i) {
                context.fillText(this.objectsMap[0].baffs[i], 820, 170 + (+20 * +i));
            }
        }


    }
    drawDMenu(context){
        context.fillStyle = 'white';
        context.fillRect(5,485,990,160);
        context.fillStyle = "black";
        context.fillRect(7,487,986,156);

        context.fillStyle = "white";
        context.font  = "18px manaspc";

        context.fillText(this.messages[0],10,505);      //0
        context.fillText(this.messages[1],10,525-1);      //1
        context.fillText(this.messages[2],10,545-2);      //2
        context.fillText(this.messages[3],10,565-3);      //3
        context.fillText(this.messages[4],10,585-4);      //4
        context.fillText(this.messages[5],10,605-5);      //5
        context.fillText(this.messages[6],10,625-5);      //6
        context.fillText(this.messages[7],10,645-7);      //7

    }

    clearScene(context) {
        //this.ctx.fillStyle = "black";
        context.clearRect(0, 0, context.width, context.height);
    }

    drawTexture(context, texture, x, y) {
        let ts = texture.tileSet;
        context.drawImage(ts.image, ts.getTilePos(texture.id), 0, +ts.tileSize, +ts.tileSize,
            x * +   texture.size, y * +texture.size, +texture.size, +texture.size);
    }

    updateMap(context) {
        let startY = this.offsetY;
        let endY = startY + this.fieldHeight - 1;
        let startX = this.offsetX;
        let endX = startX + this.fieldWidth - 1;

        for (let y = startY; y <= endY; ++y){
            for (let x = startX; x <= endX; ++x) {
                this.drawTexture(context, this.map[y][x], x - startX, y - startY);
            }
        }
        for (let i = 0; i < this.objectsMap.length;++i){
            if (this.objectsMap[i].x >= startX && this.objectsMap[i].x <= endX) {
                if (this.objectsMap[i].y >= startY && this.objectsMap[i].y <= endY) {
                    if(!this.objectsMap[i].isDead)
                        this.drawTexture(context, this.objectsMap[i],
                            this.objectsMap[i].x-startX, this.objectsMap[i].y-startY);
                }
            }
        }
        //alert(this.map);
    }

    update(context){
        this.ctx = context;
        super.update(context);
        this.clearScene(context);

        this.drawRMenu(context);
        this.drawDMenu(context);
        this.updateMap(context);
    }

    keyHandler(scene, event) {
        switch(event.keyCode) {
            case 38: //arrow up
                this.controller.moveU(scene);
                break;
            case 40: //arrow down
                this.controller.moveD(scene);
                break;
            case 37://arrow left
                this.controller.moveL(scene);
                break;
            case 39://arrow r
                this.controller.moveR(scene);
                break;
        }
        this.calcOffset();
        scene.update();
    }

    get events() {
        return {
            keyup: this.keyHandler,
        }
    }
}



