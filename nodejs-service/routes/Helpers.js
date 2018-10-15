module.exports = {
    arrayToString: function(array) {
        if(array.length == 0)
            return "";
            
        var string = array[0];
        for(var i=1; i<array.length; i++){
            string += ", " + array[i];
        }

        return string;
    },

    stringToArray: function(string) {
        return string.split(", ");
    }
}