myfunc();

function myfunc() {
var fname_out = 'd:\\555666777.csv';
AllLayers2File(app.activeDocument,fname_out);	
alert ('done');
}

function AllLayers2File(ad,fname_out)
{
var str="";
	for (var j = 0; j < ad.layers.length; j++)  
{  
 var sub = ad.layers[j].layers;  
    for (var i = 0; i < sub.length; i++) {
		str+=ad.layers[j].name+";"+sub[i].name+"\n";
        } 
}
Str2File(str,fname_out);	
}
//  *********************************************************************
//
//                       Запись в файл
//
//  *********************************************************************
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
        var res = confirm("The file already exists. Should I overwrite it", true, "titleWINonly");
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


/////////End