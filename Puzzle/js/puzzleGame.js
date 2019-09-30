var config = {
    'img': 'images/true.png',
    'width': 600, 
    'height': 600 
}

$(function() {
    var pg = new stylepuzzlegame(config)
});

var stylepuzzlegame = function(param) {
    this.img = param.img || '';

    this.btnStart = $('#START span button');
    this.btnLevel = $('#LEVEL span button');
    this.imageNew = $('#wrap #content #image');

    this.imgcells = "";

    this.imgrightposition = [];
    this.imgrandom = [];

    this.levellist = [
        [3,3]
    ];

    this.levelnow = 0;
    this.imgwidth = parseInt(this.imageNew.css('width'));
    this.imgheight = parseInt(this.imageNew.css('height'));

    this.cellwidth = this.imgwidth / this.levellist[this.levelnow][1];
    this.cellheight = this.imgheight / this.levellist[this.levelnow][0];

    this.hasStart = 0;
    this.movetime = 400;
    console.log(this)

    this.init();
}

stylepuzzlegame.prototype = {
    init: function() {
        this.imgSplit();
        this.levelSelect();
        this.gameState();
    },

    imgSplit: function() {

        this.imgrightposition = [];
        
        this.imageNew.html("");

        var cell ='';
        for (var i = 0; i < this.levellist[this.levelnow][0]; i++) {
            for (var j = 0; j < this.levellist[this.levelnow][1]; j++) {
                this.imgrightposition.push(i * this.levellist[this.levelnow][1] + j);

                cell = document.createElement("div");
                cell.className = "imgpiece";

                $(cell).css({
                    'width': (this.cellwidth - 2) + 'px',
                    'height': (this.cellheight - 2) + 'px',
                    'left': j * this.cellwidth + 'px',
                    'top': i * this.cellheight + 'px',
                    "background": "url('" + this.img + "')",
                    'backgroundPosition': (-j) * this.cellwidth + 'px ' + (-i) * this.cellheight + 'px'
                });

                this.imageNew.append(cell);
            }
        }
        this.imgcells= $('#wrap #content #image div.imgpiece');
    },

    levelSelect: function() {
        var self = this;
        
        this.btnLevel
            .bind('mousedown', function() {
                $(this).addClass('clickon');
            })
            .bind('mouseup', function() {
                $(this).removeClass('clickon');
            })
            .bind('click', function() {
                if (self.hasStart) {
                    if (!confirm("You are on the game. Are you sure you need to restart the game?")) {
                        return false;
                    } else {
                        self.hasStart = false;
                    }
                }
                self.cellOrder(self.imgrightposition);

                self.imgcells.css('cursor', 'default').unbind('mouseover').unbind('mouseout').unbind('mousedown');
            });
    },

        gameState: function() {
            var self = this;

            this.btnStart.bind('mousedown', function() {
                $(this).addClass('clickon');
            }).bind('mouseup', function() {
                $(this).removeClass('clickon');
            }).bind('click', function() {

                if (self.hasStart == 0) {

                    self.hasStart = 1;

                    self.randomArr();
                    
                    self.cellOrder(self.imgrandom);

                    self.imgcells.css({
                        'cursor':'pointer'
                    }).bind('mouseover', function() {
                        $(this).addClass('hover');
                    }).bind('mouseout', function() {
                        $(this).removeClass('hover');
                    }).bind('mousedown', function(e) {
                        
                        $(this).css('cursor', 'move');

                        var cellIndex_1 = $(this).index();
                        var cell_mouse_x = e.pageX - self.imgcells.eq(cellIndex_1).offset().left;
                        var cell_mouse_y = e.pageY - self.imgcells.eq(cellIndex_1).offset().top;

                        $(document).bind('mousemove', function(e2) {
                            self.imgcells.eq(cellIndex_1).css({
                                'z-index' : '40',
                                'left' : (e2.pageX - cell_mouse_x - self.imageNew.offset().left) + 'px',
                                'top' : (e2.pageY - cell_mouse_y - self.imageNew.offset().top) + 'px'
                            });
                        }).bind('mouseup', function(e3) {
                            var cellIndex_2 = self.cellChangeIndex((e3.pageX - self.imageNew.offset().left), (e3.pageY - self.imageNew.offset().top), cellIndex_1);

                            if (cellIndex_1 == cellIndex_2) {
                                self.cellReturn(cellIndex_1);
                            } else {
                                self.cellExchange(cellIndex_1, cellIndex_2);
                            }

                            $(document).unbind('mousemove').unbind('mouseup');
                        });

                    }).bind('mouseup', function() {
                        $(this).css('cursor', 'pointer');
                    });
                }
            });
        },

        randomArr: function() {
            this.imgrandom = [];
            var order;
            for (var i = 0, len = this.imgrightposition.length; i < len; i++) {
                order = Math.floor(Math.random() * len);
                if(this.imgrandom.length > 0) {
                    while(jQuery.inArray(order, this.imgrandom) > -1) {
                        order = Math.floor(Math.random() * len);
                    }
                }
                this.imgrandom.push(order);
            }
            return;
        },

        cellOrder: function(arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                this.imgcells.eq(i).animate({
                    'left': arr[i] % this.levellist[this.levelnow][1] * this.cellwidth + 'px',
                    'top': Math.floor(arr[i] / this.levellist[this.levelnow][0]) * this.cellheight + 'px'
                },this.movetime);
            }
        },

        cellChangeIndex: function(x, y, orig) {
            if(x < 0 || x > this.imgwidth || y < 0 || y > this.imgheight) {
                return orig;
            }
            var row = Math.floor(y / this.cellheight),
                col = Math.floor(x / this.cellwidth),
                location = row * this.levellist[this.levelnow][1] + col;
            
                var i = 0,
                    len = this.imgrandom.length;
                
                while ((i < len) && (this.imgrandom[i] != location)) {
                    i++;
                }
                return i;
        },
        
        cellExchange: function(from, to) {
            var self = this;
            
            var rowFrom = Math.floor(this.imgrandom[from] / this.levellist[this.levelnow][1]);
            var colFrom = this.imgrandom[from] % this.levellist[this.levelnow][1];
            var rowTo = Math.floor(this.imgrandom[to] / this.levellist[this.levelnow][1]);
            var colTo = this.imgrandom[to] % this.levellist[this.levelnow][1];

            var temp = this.imgrandom[from];
        
        this.imgcells.eq(from).animate({
            'top': rowTo * this.cellheight + 'px',
            'left': colTo * this.cellwidth + 'px'
        }, this.movetime, function() {
            $(this).css('z-index','10');
        });
    
        this.imgcells.eq(to).css('z-index' , '30').animate({
            'top': rowFrom * this.cellheight + 'px',
            'left': colFrom * this.cellwidth + 'px'
        }, this.movetime, function() {
            $(this).css('z-index', '10');
        
            self.imgrandom[from] = self.imgrandom[to];
            self.imgrandom[to] = temp;

            if (self.checkPass(self.imgrightposition, self.imgrandom)) {
                self.success();
            }
        });
    },

    cellReturn: function(index) {
        var row = Math.floor(this.imgrandom[index] / this.levellist[this.levelnow][1]);
        var col = this.imgrandom[index] % this.levellist[this.levelnow][1];

        this.imgcells.eq(index).animate({
            'top': row * this.cellheight + 'px',
            'left': col * this.cellwidth + 'px'
        }, this.movetime, function() {
            $(this).css('z-index', '10');
        });
    },

    checkPass: function(rightArr, puzzleArr) {
        if (rightArr.toString() == puzzleArr.toString()) {
            complete = true;
            return complete;
        }
        complete = false;
        return complete;
    },

    success: function() {
        var text;
        for (var i = 0, len = this.imgrightposition.length; i < len; i++) {
            if (this.imgcells.eq(i).has('mouseOn')) {
                this.imgcells.eq(i).removeClass('mouseOn');
            }
        }
        this.imgcells.unbind('mousedown').unbind('mouseover').unbind('mouseout');
        this.hasStart = 0;
        
        if(complete) {
            console.log("complete form");
            $("#finish").html("thanks; data from the dataset.").attr('disabled', true);
        }
    }
}

$(document).ready(function(){
		
	$("body").addClass("js");

	// Adding a "JavaScript is Enabled" Body Class

	// Click the point to open the new frame
	$("#START").click(function(){
		if($("#image").css("display")=="none"){
			$("#image").css("display","block");
		}
    });
});