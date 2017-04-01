/** Clears null properties from object
 * NOTE: this will clone the object and return the data properties which contain values
*/
exports.clean = function(obj){
    var clone = JSON.parse(JSON.stringify(obj));
    var propNames = Object.getOwnPropertyNames(clone);
    for (var i = 0; i < propNames.length; i++) {
        var propName = propNames[i];
        if (clone[propName] === null || clone[propName] === undefined) {
            delete clone[propName];
        }
    }
    return clone;
}
