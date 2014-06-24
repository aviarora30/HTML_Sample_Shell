var totalDragItems;
var totalDropArea;

var isDroppedOutside;

function initDnD() {
    totalDragItems = $(".dragItem").length;
    totalDragItems = $(".dropArea").length;


    $("#submit").bind("click", doSubmit);
    $("#submit").attr("disabled", "disabled");

    $(".dragItem").each(function(i) {
        $(this).data("dragId", i + 1).data("isDroppedAt", "null");
    });

    $(".dropArea").each(function(i) {
        $(this).data("dropAreaId", i + 1);
    });

    $(".dragItem").draggable({
        cursor: 'move',
        revert: doRevert,
        start: doStartDrag,
        stop: doStopDrag
    });

    $(".dropArea").droppable({
        accept: ".dragItem",
        tolerance: "touch",
        drop: doItemDropped
    });
}

function doStartDrag(evt, ui) {
    var temp = $(this);
    var temp1 = $(".dropArea").filter(function() {
        return $(this).data("dropAreaId") == temp.data("isDroppedAt");
    });
    temp1.removeData("itemId");

    $(this).data("isDroppedAt", "null");
    isDroppedOutside = true;
    ui.helper.zIndex(20);
}

function doStopDrag(evt, ui) {
    ui.helper.zIndex(1);
    enableDisableSubmit();
}

function doRevert(evt, ui) {
    if (isDroppedOutside == true) {
        $(this).animate({
            'left': '0px',
            'top': '0px'
        }, {
            queue: false,
            duration: 500
        });
        return true;
    } 
    return false;
}

function doItemDropped(evt, ui) {
    var tempDrag = ui.draggable;
    var tempDrop = $(this);
    if (!dropHasItem(tempDrop)) {
        isDroppedOutside = false;
        ui.draggable.position({
            of: $(this),
            my: 'left top',
            at: 'left top'
        });
        tempDrop.data("itemId", tempDrag.data("dragId"));
        tempDrag.data("isDroppedAt", tempDrop.data("dropAreaId"));
    } else {
        isDroppedOutside = true;
    }
}

function dropHasItem(dropItem) {
    if (dropItem.data("itemId")) {
        return true;
    }
    return false;
}

function enableDisableSubmit() {
    var bo = true;
    $(".dropArea").each(function(i) {
        if ($(this).data("itemId") == undefined) {
            $("#submit").attr("disabled", "disabled");
            bo = false;
            return;
        }
    });
    if (bo) {
        $("#submit").removeAttr("disabled");
    }
}

function doSubmit() {
    $("#submit").attr("disabled", "disabled");
    if (isAllCorrect()) {
        $("#feedback").text("All correct");
    } else {
        $("#feedback").text("Not all correct");
        $("#submit").text("Show");
        $("#submit").removeAttr("disabled");
        $("#submit").unbind("click");
        $("#submit").bind("click", doShow);
    }
}

function isAllCorrect() {
    var bo = true;
    $(".dropArea").each(function(i) {
        if ($(this).attr("correct") != $(this).data("itemId")) {
            bo = false;
        }
    });
    return bo;
}

function doShow() {
    $(".dragItem").each(function(i) {
    	var temp = $(this);
        var temp1 = $(".dropArea").filter(function() {
            return $(this).attr("correct") == temp.data("dragId");
        });
        $(this).css("position", "absolute");
        $(this).animate({
            'left': temp1.position().left,
            'top': temp1.position().top
        }, {
            // queue: false,
            duration: 500
        });
    });
}
