//////////////Start
/*


*/
myfunc();




function myfunc() {
 
 	 csvpath = 'd:\\work\\_stickers\\';
	 csvfilename = 'stask.csv';
	 rulesfilename = 'RulesTreatmentsLayers.csv';
	 exportpath = 'd:\\';
	 out_file_type = 'pdf';
	 var max_row = 50.0;
	 
	
 
	 

	 // rules store in script path 
		var s = $.fileName;
		var script_path = s.slice(0, s.lastIndexOf('\\'))+'\\';
	 

    // 1. Создаем список подслоев, из которого делаем список правил для кадого слоя.
    // делается один раз.
    // Запись подслоев из родительского слоя в файл
    //SublayersToCsv(app.activeDocument.layers["GelPolishMain"].layers,'d:\\555666777.txt');
    //SublayersToCsv(app.activeDocument.layers["GelPolishGlitter"].layers,'d:\\555666777.txt');
	
	
	// Пока не доделал:
	// Родительский слой должен быть включен!


    //alert('Внимание! Должен быть открыт только документ с наклейками!');
	

    var csvRules;
    csvRules = File(script_path + rulesfilename);
    var csvTask;
    csvTask = File(csvpath + csvfilename);


    if (!csvRules.exists){ alert(csvRules + ' not exist'); return;}
    if (!csvTask.exists) { alert(csvTask  + '  not exist');return;}
   var fRules = Csv2Array(csvRules);
  // var fTask = Csv2Array(csvTask);
  var fTask = Layers2Array(app.activeDocument)



   //
   var t = [];
   var k = 0;
   for (var i = 1; i < fTask.length; i++)
   {
           for (var j = 1; j < fRules.length; j++)
           {
               if (fTask[i][0] == fRules[j][2])
               {
				   if(doesLayerExist(fRules[j][0]) )
				   {
					   var data = new Array();
					   data = fRules[j];
					   data.push(fTask[i][1]);
					   data.push(GetNumSublayer(fRules[j][0], fRules[j][1]));
					   t[k] = data;
					//   if (i < 5) alert(t[k]);
					   k++;
				   }
               }
           }
   }
// t - полный массив нужных слоев с количеством наклеек в конце.

   var s="";
   var sel;

   for (var i in t) 
   {
			   app.activeDocument.layers[t[i][0]].layers[t[i][9]].visible = true;

			   //alert("active board =  "+t[i][7]);
			   setActiveArtboardBy(t[i][7]); // 7 - имя листа (Artboard name)
			   //
               app.activeDocument.selectObjectsOnActiveArtboard();
               sel = app.activeDocument.selection;
			   s+=AllText2String(sel,app.activeDocument) +"\n";
			   app.activeDocument.selection = null;
			   app.activeDocument.layers[t[i][0]].layers[t[i][9]].visible = false;
			   

		// if (i==5 )break;
	}
	Str2File(s,'d:\\__all_texts_.csv');
 alert("that's all.");
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




function AllText2String(mySelection,aa)
{
	var stmp="";
	
    if (mySelection.length > 0)
		{
		//	msgType = "Selection items: \n";
		var size;
                for (var i=0; i<mySelection.length; i++)
                {
                    if(mySelection[i].typename == "TextFrame")
                       {
						   stmp+="\""+mySelection[i].contents+"\";";

                       }
                }//	alert( msgType );
		}
		return stmp;
}



function doesLayerExist(name) {
	var layers=app.activeDocument.layers;
    for (i=0; i<layers.length; i++) {
        if (layers[i].name==name) return true;
    }
    return false;
}


function setActiveArtboardBy(name) {
    var docRef = app.activeDocument;
    var artboard = docRef.artboards.getByName(name);
    for (i = 0; i < docRef.artboards.length; i++) {
        if (docRef.artboards[i] == artboard) {
            docRef.artboards.setActiveArtboardIndex(i);
            break;
        }
    }
}

function GetNumSublayer(layer, layersub)
{
    var idoc = app.activeDocument;  
    var ilayer = idoc.activeLayer;  
	    for (i=0; i<ilayer.layers.length; i++) {  
        var sublayer = ilayer.layers[i];  
		alert(sublayer.pageItems[0].name);
		if(isEmpty(sublayer.pageItems[0].name))continue;
	//	if(sublayer.pageItems[0].name =='')continue;
		alert(sublayer.pageItems[0].contents);
        sublayer.name = sublayer.pageItems[0].name || sublayer.pageItems[0].contents;  
    }
	
			var myLayer = app.activeDocument.layers[layer];
			for (i = 0; i < myLayer.layers.length; i++)
			{
				var mySublayer = myLayer.layers[i];
				if (mySublayer.name == layersub) 
				{
					//alert(mySublayer.name);
					return i;
					   }
			}

}

function isEmpty(val)
{
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

//  *********************************************************************
//
//            Запись списка подслоев в файл из родительского слоя
//
//  *********************************************************************
function SublayersToCsv(sub,filepath)
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
        // loop the list and write each item to the file
        for (var i = 0; i < sub.length; i++) {
            write_file.writeln(sub[i].name+';'+i);
        }
        // allways close files!
        write_file.close();
    }
 }



//  *********************************************************************
//
//           читаем csv и запихиваем текст в массив.
//
//  *********************************************************************
function Csv2Array(fileObj) {
    var fileArray, thisLine, csvArray;
    fileArray = [];
    fileObj.open('r');
    while (!fileObj.eof) {
        thisLine = fileObj.readln();
        csvArray = thisLine.split(';');
        fileArray.push(csvArray);
    };
    fileObj.close();
    var t = [];
    for (var i = 0; i < fileArray.length; i++) {
        var data = new Array();
        data = fileArray[i].toString().split(','); // в массиве уже нет ";" он разделен ","
        t[i] = data;// new Array(data);// new Array(data[0], data[1])
    }
    return t;
};


function Layers2Array(ad) {
	var t = [];
	for (var j = 0; j < ad.layers.length; j++)  
		{  
		var sub = ad.layers[j].layers;  

			var data = [ad.layers[j].name,1,1,1];
			t.push(data);
			for (var i = 0; i < sub.length; i++) 
				{
					var data = [sub[i].name,1,1,1];
					t.push(data);
				} 
		}
    return t;
};


/////////End