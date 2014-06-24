var courseXMLPath = "xml/course.xml";
var soundArr = new Array();
var pagePathArr = new Array();
var currentPage = 0;
var totalPages = 0;
var isPlaying;

function init() {
    adjustSize();
    isPlaying = false;
    loadXml(courseXMLPath, parseCourseXML);
}

function adjustSize() {
    var topMargin = (($("header").height() - $("#topControls").height()) / 2);
    $("#topControls").css("margin-top", topMargin + "px");
}

function parseCourseXML(xmlObj) {
    var moduleTemp = $(xmlObj).find('module').find('pages');
    moduleTemp.each(function(ind, val) {
        pagePathArr.push($(val).attr("src"));
        soundArr.push($(val).attr("hasAudio"));
        totalPages++;
    });
    loadPage();
}

function loadPage() {
    var pageURL = pagePathArr[currentPage];
    $.ajax({
        url: pageURL,
        type: 'GET',
        dataType: "text",
        cache: true,
        success: function(data) {
            $("#contentLoader").html(data);
            updatePageCounter();
            enableDisableNextBack();
            enableDisablePlayPause();
        },
        error: function(e) {
            alert('A network error prevented this operation, Please try later.');
        }
    });
}

function doBack() {
    if (currentPage > 0) {
        doPlayPause();
        $("audio").remove();
        currentPage--;
        loadPage();
    }
}

function doNext() {
    if (currentPage < totalPages - 1) {
        doPlayPause();
        $("audio").remove();
        currentPage++;
        loadPage();
    }
}

function doPlayPause() {
    if (isPlaying == true) {
        $("#playPauseBtn").removeClass("pauseBtn");
        $("#playPauseBtn").addClass("playBtn");
        if ($("audio").get(0) != undefined) {
            $("audio").get(0).pause();
        }
        isPlaying = false;
    } else {
        $("#playPauseBtn").removeClass("playBtn");
        $("#playPauseBtn").addClass("pauseBtn");
        if ($("audio").get(0) != undefined) {
            $("audio").get(0).play();
        }
        isPlaying = true;
    }

}

function enableDisablePlayPause () {
    if(soundArr[currentPage] == "false") {
        $("#playPauseBtn").removeClass("playBtn");
        $("#playPauseBtn").removeClass("pauseBtn");
        $("#playPauseBtn").addClass("playBtnDisabled");
        $("#playPauseBtn").attr('onclick','').unbind('click');
    } else {
        $("#playPauseBtn").removeClass("playBtnDisabled");
        $("#playPauseBtn").addClass("playBtn");
        $("#playPauseBtn").click(doPlayPause);
        doPlayPause();
    }
}

function enableDisableNextBack() {
    if (currentPage == 0) {
        disableBack();
    } else {
        enableBack();
    }

    if (currentPage >= totalPages - 1) {
        disableNext();
    } else {
        enableNext();
    }
}

function disableBack() {
    $("#backBtn").removeClass("backBtn").addClass("backBtnDisabled");
}

function disableNext() {
    $("#nextBtn").removeClass("nextBtn").addClass("nextBtnDisabled");
}

function enableBack() {
    $("#backBtn").removeClass("backBtnDisabled").addClass("backBtn");
}

function enableNext() {
    $("#nextBtn").removeClass("nextBtnDisabled").addClass("nextBtn");
}

function updatePageCounter() {
    $("#pageCounter").text("Page " + (currentPage + 1) + " of " + totalPages);
}
