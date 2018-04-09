'use strict';

//Вектор

   class Vector{
	  constructor(x = 0,y = 0){
		this.x = x;
		this.y = y;
	}
  
	//Метод plus
  
	plus(vector){
		if(!(vector instanceof Vector)){
			throw  new Error('Можно прибавлять к вектору только вектор типа Vector');
		}
		return new Vector(this.x + vector.x, this.y + vector.y);
	}
  
	//Метод times
  
	times(factor){
		return new Vector(this.x * factor, this.y * factor);
	}
}

//Движущийся объект
//класс Actor

class Actor{
	constructor(pos = new Vector(0,0), size = new Vector(1,1), speed = new Vector(0,0)){
		if (!(pos instanceof Vector)){
			throw new Error('Должно быть определено свойство pos, в котором размещен Vector');
		}
		
		if (!(size instanceof Vector)){
			throw new Error('Должно быть определено свойство size, в котором размещен Vector');
		}
		
		if (!(speed instanceof Vector)){
			throw new Error('Должно быть определено свойство speed, в котором размещен Vector');
		}
		
		this.pos = pos;
		this.size = size;
		this.speed = speed;	
	}
	
	get type(){
		return 'actor';
	}
	
	act(){} //метод act, который ничего не делает.
	
	get left(){
		return this.pos.x;
	}
	
	get right(){
		return this.pos.x + this.size.x;
	}
	
	get top(){
		return this.pos.y;
	}
	
	get bottom(){
		return this.pos.y + this.size.y;
	}
  
	//Метод isIntersect
  
	isIntersect(actor){
		if(!(actor instanceof Actor)){
			throw new Error(`Переменная actor должна быть типа Actor: ${actor}`);
		}
		
		if(this === actor){
			return false;
		}
		
		if(actor.size.x < 0 || actor.size.y < 0){
			return false;
		}
		
		if((this.pos.x === actor.pos.x + actor.size.x)||(actor.pos.x === this.pos.x + actor.size.x)||
		(this.pos.y === actor.pos.y + actor.size.y)||(actor.pos.y === this.pos.y + actor.size.y)){
			return false;
		}
		 
		 return (this.pos.x <= actor.pos.x + actor.size.x && this.pos.x >= actor.pos.x && 
		 this.pos.y <= actor.pos.y + actor.size.y && this.pos.y >= actor.pos.y) ||
		 (this.pos.x <= actor.pos.x + actor.size.x && this.pos.x >= actor.pos.x && 
		 this.pos.y + this.size.y <= actor.pos.y + actor.size.y && this.pos.y + this.size.y >= actor.pos.y) ||
		 (this.pos.x + this.size.x <= actor.pos.x + actor.size.x && this.pos.x + this.size.x >= actor.pos.x && 
		 this.pos.y <= actor.pos.y + actor.size.y && this.pos.y >= actor.pos.y) ||
		 (this.pos.x + this.size.x <= actor.pos.x + actor.size.x && this.pos.x + this.size.x >= actor.pos.x && 
		 this.pos.y + this.size.y <= actor.pos.y + actor.size.y && this.pos.y + this.size.y >= actor.pos.y) ||
		 (actor.pos.x <= this.pos.x + this.size.x && actor.pos.x >= this.pos.x && 
		 actor.pos.y <= this.pos.y + this.size.y && actor.pos.y >= this.pos.y) ||
		 (actor.pos.x <= this.pos.x + this.size.x && actor.pos.x >= this.pos.x && 
		 actor.pos.y + actor.size.y <= this.pos.y + this.size.y && actor.pos.y + actor.size.y >= this.pos.y) ||
		 (actor.pos.x + actor.size.x <= this.pos.x + this.size.x && actor.pos.x + actor.size.x >= this.pos.x && 
		 actor.pos.y <= this.pos.y + this.size.y && actor.pos.y >= this.pos.y) ||
		 (actor.pos.x + actor.size.x <= this.pos.x + this.size.x && actor.pos.x + actor.size.x >= this.pos.x && 
		 actor.pos.y + actor.size.y <= this.pos.y + this.size.y && actor.pos.y + actor.size.y >= this.pos.y);
	}
}

//Игровое поле
//класс Level

class Level{
	constructor(grid=[], actors=[]){
		for(const actor of actors){
			if(actor.type === 'player'){
				this.player = actor;
				break;
			}
		}
	
		this.grid = grid;
		this.actors = actors;
		this.height = grid.length;
		this.width = 0;
		
		if(grid.length !== 0){
			for(const arr of this.grid){
				if(typeof arr != 'undefined'){
					if(this.width < arr.length){
						this.width = arr.length;
					}
				}
			}
		}
		
		this.status = null;
		this.finishDelay = 1;
	}
  
  //Метод isFinished
	
	isFinished(){
		return(this.status != null && this.finishDelay < 0);
	}
  
	//Метод actorAt
	actorAt(actor){
		if(!(actor instanceof Actor)){
			throw new Error('Движущийся объект должен иметь тип Actor');
		}
		
		if(this.grid === undefined ){
			return undefined;
		}
		
		for(const act of this.actors){
			if (typeof act !='undefined' && actor.isIntersect(act)){
				return act;
			}
		}
		return undefined;	
	}
	
  //Метод obstacleAt
  
	obstacleAt(pos, size){
		if(!(pos instanceof Vector)){
			throw 'pos должен иметь тип Vector';
		}
		
		if(!(size instanceof Vector)){
			throw 'size должен иметь тип Vector';
		}
		
		const xStart = Math.floor(pos.x);
		const xEnd = Math.ceil(pos.x + size.x);
		const yStart = Math.floor(pos.y);
		const yEnd = Math.ceil(pos.y + size.y);

		if (xStart < 0 || xEnd > this.width || yStart < 0) {
			return 'wall';
		}

		if (yEnd > this.height) {
			return 'lava';
		}

		for (let y = yStart; y < yEnd; y++) {
			for (let x = xStart; x < xEnd; x++) {
				const obstacle = this.grid[y][x];
				if (typeof obstacle !== 'undefined') {
					return obstacle;
				}
			}
		}
		return undefined;
	}
  
	//Метод removeActor
  
	removeActor(actor){
		const indexActor = this.actors.indexOf(actor);
		if(indexActor != -1){
			this.actors.splice(indexActor, 1);
		}
	}
  
  //Метод noMoreActors
	
	noMoreActors(type){
		if(this.actors){
			for(const actor of this.actors){
				if(actor.type === type){
					return false;
				}
			}
		}
		return true;
	}
	
  //Метод playerTouched
  
	playerTouched(type, actor){
		if(this.status != null){
			return;
		}
		
		if(type === 'lava' || type === 'fireball'){
			this.status = 'lost';
		}
		
		if(type === 'coin' && actor.type === 'coin'){
			this.removeActor(actor);
			if(this.noMoreActors('coin')){
				this.status = 'won';
			}
		}
	}
}

//класс LevelParser

class LevelParser{
	constructor(dictionary){
		this.dictionary = dictionary;
	}
  
	//Метод actorFromSymbol
  
	actorFromSymbol(symbol){
		if(typeof symbol === 'undefined'){
			return undefined;
		}
		
		if(typeof this.dictionary ===  'undefined'){
			return undefined;
		}
		
		return this.dictionary[symbol];
	}
  
	//Метод obstacleFromSymbol
  
	obstacleFromSymbol(symbol){
		const symbols = { 'x': 'wall', '!': 'lava' };
		return symbols[symbol];
	}
  
  //createGrid
	
	createGrid(strings){
		const array = [];
		let i = 0;
		
		for(const string of strings){
			array[i] = [];
			for(let j = 0; j < string.length; j++){
				const symbol = string.charAt(j);
				if(symbol === 'o' || symbol === 'x' || symbol === '!'){
					array[i].push(this.obstacleFromSymbol(symbol));
				}else{
					array[i].push(undefined);
				}
			}
			
			i++;
		}
		
		return array;
	}
  
	//Метод createActors
  
	/*createActors(strings){
		const array = [];
		let j = 0;
		
		for(let k = 0; k < strings.length; k++ ){
			const string = strings[k];
			for(let i = 0; i < string.length; i++){
				const symbol = string.charAt(i);
				const actorCtr = this.actorFromSymbol(symbol);
				if(typeof actorCtr === 'function'){
					const actor = new actorCtr();
					if(actor instanceof Actor){
						array[j] = new actorCtr();
						array[j].pos = new Vector(i,k);
						j++;
					}
				}
			}
		}
		
		return array;
	}*/
  
  createActors(strings){
        const array = [];
        for(let k = 0; k < strings.length; k++ ){
            const string = strings[k];
            for(let i = 0; i < string.length; i++){
                const Obj = this.actorFromSymbol(strings[k][i]);
                if (typeof Obj === 'function') {
                    const actor = new Obj(new Vector(i, k));
                    if (actor instanceof Actor) {
                        array.push(actor);
                    }
                }
            }
        }

        return array;
    }
  
  //Метод parse
	
	parse(strings){
	return new Level(this.createGrid(strings), this.createActors(strings));
	}
}
//Шаровая молния

//Класс Fireball
class Fireball extends Actor{
	constructor(pos  = new Vector(0,0),speed = new Vector(0,0)){	
		super(pos, new Vector(1,1), speed);
	}
	
	get type(){
		return 'fireball';
	}

  //Метод getNextPosition
  
	getNextPosition(time = 1){
		return this.pos.plus(this.speed.times(time));
	}
  
 //Метод handleObstacle
  
	handleObstacle(){
		this.speed = this.speed.times(-1);
	}
  
//Метод act
  
	act(time, level){
		const nextPos = this.getNextPosition(time);
		if(level.obstacleAt(nextPos, this.size)){
			this.handleObstacle();
		}else{
			this.pos = nextPos;
		}
	}
}

//класс HorizontalFireball

class HorizontalFireball extends Fireball{
	constructor(pos = new Vector(0,0)){
		super(pos,new Vector(2,0));
	}
}

//класс VerticalFireball

class VerticalFireball extends Fireball{
	constructor(pos = new Vector(0,0)){
		super(pos, new Vector(0,2));
	}
}

//класс FireRain

class FireRain extends Fireball{
	constructor(pos = new Vector(0,0)){
	super(pos, new Vector(0,3));
		this.initPos = pos;
	}
	
	get type(){
		return 'firerain';
	}

	handleObstacle(){
		this.pos = this.initPos;
	}
}

//Класс Coin

class Coin extends Actor{
	constructor(pos=new Vector(1,1)){
		super(new Vector(pos.x + 0.2, pos.y + 0.1), new Vector(0.6,0.6));
		this.initPos = this.pos;
		this.springSpeed = 8;
		this.springDist = 0.07;
		this.spring = Math.random() * 2*Math.PI
	}
	
	get type(){
		return 'coin';
	}
	
  //Метод updateSpring
  
	updateSpring(time = 1){
			this.spring += this.springSpeed*time;
		}
		
  //Метод getSpringVector
  
	getSpringVector(){
		return new Vector(0,Math.sin(this.spring)*this.springDist);
	}
	
	getNextPosition(time = 1){
		this.updateSpring(time);
		const springVector = this.getSpringVector();
		return this.initPos.plus(springVector);//это правильный способ,но почему-то монетки сбиваются в одну
    //return new Vector(this.pos.x,this.pos.y + springVector.y*time);// монетки на месте, но это неправильный способ
    
	}
  
	//Метод act
  
	act(time){
		this.pos = this.getNextPosition(time);
	}	
}

//Игрок

//Класс Player

class Player extends Actor{
	constructor(pos=new Vector(1,1)){
		super(new Vector(pos.x, pos.y - 0.5), new Vector(0.8,1.5));	
	}
	
	get type(){
		return 'player';
	}
}

const schemas = [
  [
    '           ',
    '   h       ',
    '           ',
    '       o   ',
    '@   o  xxx ',
    '  xx       ',
    'xx   v     ',
    '         '
  ],
  [
    '   v      ',
    '          ',
    '          ',
    '@     o   ',
    '        x ',
    '  o  xxx  ',
    'xxx       ',
    '         '
  ],
   [
    '  v          ',
    '           v ',
    '           o ',
    '@     o  o   ',
    '    o   xx   ',
    '    xxx      ',
    'x            ',
    '            '
  ],
  [
    '      v    ',
    '    h      ',
    '           ',
    '         o ',
    ' @       xx',
    '     o     ',
    '      xx   ',
    ' xx        ',
    '            '
  ]
];

const actorDict = {
  '@': Player,
  'v': VerticalFireball,
  'o': Coin,
  'h': HorizontalFireball,
  'f': FireRain
  }

const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
  .then(() => document.write('Поздравляем ! Вы выиграли приз!'));