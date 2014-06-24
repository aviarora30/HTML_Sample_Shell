function loadXml(strPath, fnCallback) {
    $.ajax({
        type: "GET",
        url: strPath,
        dataType: "xml",
        success: fnCallback
    });
}
