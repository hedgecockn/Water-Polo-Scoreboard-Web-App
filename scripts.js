function updateValues(){
	var settings = document.getElementById("settInputs");
	gTime = settings.elements[0].value;
	document.getElementById("cur-game-time").innerHTML = gTime;
	sTime = settings.elements[1].value;
	document.getElementById("cur-shot-time").innerHTML = sTime;
}

function hideOrShow(id){
	if (document.getElementById(id).classList.contains("hidden")){
		document.getElementById(id).classList.remove("hidden");
	}
	else{
		document.getElementById(id).classList.add("hidden");
	}
}
function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

function addHome(){
	var goals = document.getElementById("homeGoals").innerHTML;
	goals ++;
	document.getElementById("homeGoals").innerHTML = goals;
}
function subHome(){
	var goals = document.getElementById("homeGoals").innerHTML;
	goals --;
	document.getElementById("homeGoals").innerHTML = goals;
}

function addGuest(){
	var goals = document.getElementById("guestGoals").innerHTML;
	goals ++;
	document.getElementById("guestGoals").innerHTML = goals;
}
function subGuest(){
	var goals = document.getElementById("guestGoals").innerHTML;
	goals --;
	document.getElementById("guestGoals").innerHTML = goals;
}

function gTimer (settPos, id){
	var paused = true;
	var delta = 0;
	var interval = null;
	var display;
	var total;
	var settings = document.getElementById("settInputs");

	this.getTotal = function(){
		time = settings.elements[settPos].value;
			timeArr = time.split(":");
			timeMins = parseInt(timeArr[0]);
			timeSecs = parseInt(timeArr[1]);
			total = 60000*timeMins + 1000*timeSecs;
			return total;
	}

	this.getPaused = function(){
		return paused;
	}
	
	this.startStopTimer = function(){
		if (paused == true){
			settings = document.getElementById("settInputs");
			time = settings.elements[settPos].value;
			timeArr = time.split(":");
			timeMins = parseInt(timeArr[0]);
			timeSecs = parseInt(timeArr[1]);
			total = 60000*timeMins + 1000*timeSecs;
			document.getElementById(id).innerHTML = time;
			this.startTimer(total);
		}
		else{
			paused = true;
			clearInterval(interval);
			total -= delta;
		}
	}

	this.startTimer = function(total){
		paused = false;
		var start = Date.now();
		interval = setInterval(function() {
			delta = Date.now() - start;
			display = millisToMinutesAndSeconds(total - delta);
			settings.elements[settPos].value = display;
			document.getElementById(id).innerHTML = display;
			if (delta >= total){
				document.getElementById(id).innerHTML = "0:00";
				clearInterval(interval);
			}
		}, 1000); // update about every second
	}
}




function sTimer (settPos, id){
	var paused = true;
	var delta = 0;
	var interval = null;
	var display;
	var total;
	var settings = document.getElementById("settInputs");
	
	this.startStopTimer = function(){
		if (gameTimer.getPaused() == false){
			settings = document.getElementById("settInputs");
			time = settings.elements[settPos].value;
			total = 1000*time;
			document.getElementById(id).innerHTML = time;
			this.startTimer(total);
		}
		else{
			clearInterval(interval);
			total -= delta;
		}
	}

	this.startTimer = function(tot){
		if (gameTimer.getPaused() == false){
			var start = Date.now();
			interval = setInterval(function() {
				delta = Date.now() - start;
				display = Math.ceil((tot - delta)/1000);
				settings.elements[settPos].value = display;
				document.getElementById(id).innerHTML = display;
				if (delta > tot){
					shotTimer.resetShotClock();
				}
			}, 1000); // update about every second
	}
		else{
			settings.elements[settPos].value = Math.ceil(tot/1000);
			document.getElementById(id).innerHTML = Math.ceil(tot/1000);
			total = tot;
		}
	}

	this.resetShotClock = function(){
		//stopping shot clock if running
		clearInterval(interval);
		//if game clock is greater than shot clock length
		 if (gameTimer.getTotal() >= 35000){
			total = 35010;
			//keeps clock ticks synced
			gameTimer.startStopTimer();
			gameTimer.startStopTimer();
			this.startTimer(total);
		 }
		 //if game clock is lesser than shot clock length
		else{
			total = gameTimer.getTotal();
			//if gameClock is zero
			if (total <= 0){
				document.getElementById(id).innerHTML = "0";
				clearInterval(interval);
			}
			else{
				//keeps clock ticks synced
				gameTimer.startStopTimer();
				gameTimer.startStopTimer();
				this.startTimer(total);
			}
		}
	}
}

var gameTimer = new gTimer(0, "cur-game-time");
var shotTimer = new sTimer(1, "cur-shot-time");