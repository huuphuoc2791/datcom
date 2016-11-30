var dsMonAn = [];
var monanElements = $(".monan p");
$.each(monanElements, function (index, item) {
    var monan1 = $(item).html();

    var monan2 = monan1.toLowerCase();
    var monan = monan2.substr(0, 1).toUpperCase() + monan2.substr(1, monan2.length);

    dsMonAn.push({menuName: monan, price: 30000});
});

var message = {
    data: {
        menuItems: dsMonAn
    },
    methodName:'UpdateMenuByDate_FromComNhaViet',
};

var url = 'http://www.ple-server.me/datcom/api';
$.post(url,message,function() {
    console.log("Done");
}, "json");