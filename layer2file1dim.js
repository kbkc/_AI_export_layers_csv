myfunc();

function myfunc() {


ta = AllLayers2Array(app.activeDocument);
Str2File(ta,'d:\\123.csv');
alert ('done');
}

// list of all layers to array
function  AllLayers2Array(ad)
{
var str="";
	for (var j = 0; j < ad.layers.length; j++)  
{  
 var sub = ad.layers[j].layers;  
    str += ad.layers[j].name+"\n";
    for (var i = 0; i < sub.length; i++) {
		str+=sub[i].name+"\n";
        } 
}
return str	
}



function Str2File(arr,filepath)
{
  //var randomname = "layers";
  // get the textfile
  //  var filepath = "d:\\" + randomname + ".csv";
    var write_file = File(filepath);
    if (!write_file.exists) {
        // if the file does not exist create one
        write_file = new File(filepath);
    } else {
        // if it exists ask the user if it should be overwritten
        var res = confirm("File " +write_file+" already exists. Should I overwrite it?", true, "Achtung!");
        // if the user hits no stop the script
        if (res !== true) {
            return;
        }
    }
    var out; // our output
    // we know already that the file exist
    // but to be sure
    if (write_file !== '') {
        //Open the file for writing.
        out = write_file.open('w', undefined, undefined);
        write_file.encoding = "UTF-8";
        write_file.lineFeed = "Unix"; //convert to UNIX lineFeed
        // txtFile.lineFeed = "Windows";
        // txtFile.lineFeed = "Macintosh";
    }
    // got an output?
    if (out !== false) {
        write_file.write(arr);
        // allways close files!
        write_file.close();
    }
 }
