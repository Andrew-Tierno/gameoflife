function Grid(sizex, sizey) {
	this.world = new Array();
	this.szx = sizex;
	this.szy = sizey; 
	this.age = null;
}
Grid.prototype.at = function at(x,y) {
	return this.world[this.idx(x,y)];
}
Grid.prototype.idx = function idx(x,y) {
        return ((this.szy + (y % this.szy)) + this.szy)*this.szx + ((this.szx + (x % this.szx)) % this.szx);
}
Grid.prototype.neighborsCount = function neighborsCount(x,y) {
	var nct = 0;
        nct += (this.isAlive(x, y-1) ? 1 : 0) + (this.isAlive(x+1, y-1) ? 1 : 0) + (this.isAlive(x+1, y) ? 1 : 0) + (this.isAlive(x+1, y+1) ? 1 : 0) + (this.isAlive(x, y+1) ? 1 : 0) 
                + (this.isAlive(x-1, y+1) ? 1 : 0) + (this.isAlive(x-1, y) ? 1 : 0) + (this.isAlive(x-1, y-1) ? 1 : 0);
	return nct;
}
Grid.prototype.generate = function generate(x,y) {
	this.place(1,x,y);
}
Grid.prototype.isAlive = function isAlive(x,y) {
	return this.at(x,y)===1;
}
Grid.prototype.place = function place(val, x,y) {
	this.world[this.idx(x,y)] = val;
}
Grid.prototype.kill = function kill(x,y) {
	this.place(0, x,y);
}
Grid.prototype.isNew = function() {
        return this.age === null;
}
Grid.prototype.advance = function advance() {
	var nworld = new Array();
	var nct = 0;
	var alive = false; 
	for(var y = 0; y < this.szy; y++) {
		for(var x = 0; x < this.szx; x++) {
			nct = this.neighborsCount(x,y);
			alive = this.isAlive(x,y); 
                        if(alive && (nct < 2 || nct > 3)) {
                                alive = false;
                        }
                        else if (nct==3) {
                                alive = true;
			}
			nworld[this.idx(x,y)] = (alive) ? 1 : 0 ;
		}
	}
	alive = false;
	for(var y = 0; y < this.szy; y++) {
		for(var x = 0; x < this.szx; x++) {
			alive = this.isAlive(x,y);
			if (alive && nworld[this.idx(x,y)]===0) {
				this.kill(x,y);
			}
			if (!alive && nworld[this.idx(x,y)]===1) {
				this.generate(x,y);
			}
		}
	}
	this.age++;
} 

Grid.prototype.draw = function draw(cellSize) {
	if (cellSize == undefined) cellSize = 3; 
	var canvas = document.getElementById("view");
	var ctx = canvas.getContext("2d"); 
	ctx.fillStyle = "cadetblue";
        ctx.strokeStyle = '#e1e1e1';
        ctx.clearRect(0, 0, 512, 512);
	for(var y = 0; y < this.szy; y++) {
		for(var x = 0; x < this.szx; x++) {
			if(this.isAlive(x,y)) {
				ctx.beginPath();
				ctx.rect(x*8, y*8, 8, 8);
                                ctx.fill();
			}
                        //else ctx.stroke();
		}
	}
        
}
Grid.prototype.randomize = function randomize() {
	var t = 0;
	for(var y = 0; y < this.szy; y++) {
		for(var x = 0; x < this.szx; x++) {
			t = Math.random();
			this.place((t > 0.5) ? 0 : 1, x, y); 
		}
	}
	this.age++;
} 
Grid.prototype.next = function next() {
	(this.isNew()) ? this.randomize() : this.advance();
	var canvas = document.getElementById("view");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width, canvas.height);
	this.draw(cellSize);
}
var world  = new Grid(200,200);
var cellSize = 5; 
setInterval("world.next()",40);