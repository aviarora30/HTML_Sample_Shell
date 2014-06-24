var currentAudio = 1;
var totalAudio;

function initTextPage() {
    hideAllText();
    //loadAudio(currentAudio);
}

function hideAllText() {
    var temp = $('div[id^="text_"]').filter(
        function() {
            return this.id.match(/\d+$/);
        }).css("display", "none");
    totalAudio = temp.length;
}

function loadAudio(currentAudio) {
	console.log("loadAudio"+currentAudio);
    var audio = $('<audio>');
    addSource(audio, 'pages/audio/text_'+currentAudio+'.mp3');
    audio.appendTo('#pageBody');
    audio.on("canplay", function(e) {
    	$("#text_" + currentAudio).css("display", "block");
    	this.play()
    });
    audio.on("canplay canplaythrough", function() {
    	$("#text_" + currentAudio).css("display", "block");
    	this.play()
    });

    audio.on("ended", audioEnded);
}

function addSource(elem, path) {
    $('<source>').attr('src', path).appendTo(elem);
}

function audioEnded () {
	currentAudio++;
	if(currentAudio <= totalAudio) {
		loadAudio(currentAudio);
	}
}
