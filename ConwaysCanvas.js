function Organism() {
	this.isAlive = false;
	this.livingNeighbors = 0;
}

function Grid(numRows, numCols, canvas) {
	this.numRows = numRows;
	this.numCols = numCols;

	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');

	this.cellHeight = this.canvas.height / this.numRows;
	this.cellWidth = this.canvas.width / this.numCols;
	
	this.dwellers = [];
}

Grid.prototype.init = function() {
	var x = 0,
		y = 0;
	for(var rows = 0; rows < this.numRows; rows++) {
		this.dwellers.push([]);
		for(var columns = 0; columns < this.numCols; columns++) {			
			this.ctx.strokeRect(x,y,this.cellWidth,this.cellHeight);			
			
			var baby = new Organism();
			this.dwellers[rows].push(baby);
			if(Math.random() < .2) {
				baby.isAlive = true;
				this.ctx.fillStyle = 'rgb('+Math.floor(Math.random()*255) +','+Math.floor(Math.random()*255) +','+Math.floor(Math.random()*255)+')';
				this.ctx.fillRect(x,y,this.cellWidth,this.cellHeight);
			}

			x = x + this.cellWidth;			
		}
		x = 0;
		y = y + this.cellHeight;
	}
}

Grid.prototype.countNeighbors = function() {
	for(var r = 0; r < this.numRows; r++){
		for(var c = 0; c < this.numCols; c++) {
			var currentOrganism = this.dwellers[r][c];
			currentOrganism.livingNeighbors = 0;

			for(var x = (r-1); x <= (r+1); x++) {
				for (var y = (c-1); y <= (c+1); y++) {
					
					var valid = this.isIndexValid(x, y);
					if(!((x == r) && (y == c)) && valid) {
						var neighbor = this.dwellers[x][y];
						if(neighbor.isAlive) {
							currentOrganism.livingNeighbors++;
						}
					}
                }
			}
		}
	}
}

Grid.prototype.updateOrganisms = function() {
	for(var r = 0; r < this.numRows; r++){
		for(var c = 0; c < this.numCols; c++) {
			var currentOrganism = this.dwellers[r][c];			           
            
            if(currentOrganism.livingNeighbors == 3) {
                currentOrganism.isAlive = true;     
                this.ctx.fillStyle = 'rgb('+Math.floor(Math.random()*255) +','+Math.floor(Math.random()*255) +','+Math.floor(Math.random()*255)+')';       
                this.ctx.fillRect(c*this.cellWidth, r*this.cellHeight, this.cellWidth, this.cellHeight);    
            } else if (currentOrganism.livingNeighbors <= 1 || currentOrganism.livingNeighbors >= 4) {
                currentOrganism.isAlive = false;
                this.ctx.clearRect(c*this.cellWidth, r*this.cellHeight, this.cellWidth, this.cellHeight);
                this.ctx.strokeRect(c*this.cellWidth, r*this.cellHeight, this.cellWidth, this.cellHeight);
            }
		}
	}
}

Grid.prototype.render = function() {
	console.log('rendering');
	this.countNeighbors();
	this.updateOrganisms();
}

Grid.prototype.isIndexValid = function(x, y) {
	var isIndexValid = true;
    if(x < 0 || y < 0 || x >= this.numRows	 || y >= this.numCols) {
        isIndexValid = false;
    }
    return isIndexValid;
}

conwaysGrid = new Grid(20, 20, document.getElementById('conwaysCanvas'));
conwaysGrid.init();

document.getElementById('startConways').addEventListener('click', function() {
	//conwaysGrid.render();
	setInterval(conwaysGrid.render.bind(conwaysGrid), 500);
}, false);