// 部分IE版本可能没有 document，getElementsByClassName
function getEleByCls(clsName, fatherEleName) {
    fatherEleName = (fatherEleName != null) ? fatherEleName : document;
    if (fatherEleName.getElementsByClassName) {
        return fatherEleName.getElementsByClassName(clsName);
    } else {
        var NodeLists = fatherEleName.getElementsByTagName('*');
        var elements = [];
        for (var i = 0, len = NodeLists.length; i < len; i++) {
            var childNames = NodeLists[i].className.split(' ');
            for (var j = 0, len = childNames.length; j < len; j++) {
                if (childNames[j] == clsName) {
                    elements.push(NodeLists[i]);
                    break;
                }
            }
        }
        return elements;
    }
}