function Grid(sizex, sizey) {
	this.world = new Array();
	this.szx = sizex;
	this.szy = sizey; 
	this.age = null;
	this.automaticIntervalID = null;
	this.updateTime = 1000;
	this.automatic = false;
	this.isGridEnabled = true;
	this.cellSize = 8;
	this.draw();
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
	var canvas = document.getElementById("view");
	var ctx = canvas.getContext("2d"); 
	ctx.clearRect(0, 0, 512, 512);
	ctx.fillStyle = "cadetblue";
    ctx.strokeStyle = '#e1e1e1';
	for(var y = 0; y < this.szy; y++) {
		for(var x = 0; x < this.szx; x++) {
			if(this.isAlive(x,y)) {
				ctx.beginPath();
				ctx.rect(x*cellSize, y*this.cellSize, this.cellSize, this.cellSize);
                                ctx.fill();
			}
                        //else ctx.stroke();
		}
	}
	console.log("Grid:" + Boolean(this.isGridEnabled));
	if (this.isGridEnabled) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = .5;
		for (var i = 1; i < 512 / this.cellSize; i++) {
			ctx.beginPath();
			ctx.moveTo(this.cellSize * i, 0);
			ctx.lineTo(this.cellSize * i, 512);
			ctx.stroke(); 
		}
		for (var i = 1; i < 512 / this.cellSize; i++) {
			ctx.beginPath();
			ctx.moveTo(0, this.cellSize * i);
			ctx.lineTo(512, this.cellSize * i);
			ctx.stroke(); 
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
	document.getElementById("day").innerHTML = "Day " + this.age;
	var canvas = document.getElementById("view");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width, canvas.height);
	this.draw(this.cellSize);
}
Grid.prototype.switchAutomatic = function switchAutomatic() {
	this.automatic = !this.automatic;
	if (this.automatic) {
		this.automaticIntervalID = setInterval("world.next()", this.updateTime);
		document.getElementById("switch").innerHTML = "Manual";
		document.getElementById("next").disabled = true; //Disable manual controls during automatic
	} else {
		window.clearInterval(this.automaticIntervalID);
		document.getElementById("switch").innerHTML = "Automatic";
		document.getElementById("next").disabled = false; //Reenable manual controls
	}
}
Grid.prototype.checkOptions = function checkOptions() {
	if (this.cellSize != parseInt(document.getElementById("cellSize").value)) {
		this.cellSize = parseInt(document.getElementById("cellSize").value);
		this.draw(this.cellSize);
	}
	if (this.isGridEnabled != document.getElementById("grid").checked) {
		this.isGridEnabled = document.getElementById("grid").checked;
		this.draw(this.cellSize);
	}
	if (this.automatic) {
		var currMSPD = (1 / document.getElementById("dps").value) * 1000; //The current Milliseconds per Day can be found as (1 / Days per Second) times 1000 (conversion factor)
		if (this.updateTime != currMSPD) { //If the update time does not reflect the user input, change it
			this.updateTime = currMSPD;
			window.clearInterval(this.automaticIntervalID);
			this.automaticIntervalID = setInterval("world.next()", this.updateTime);
		}
	}
}
var world  = new Grid(200,200);
setInterval("world.checkOptions()", 500);
//setInterval("world.next()",40);