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
	 var max_row = 30.0;
	 
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
	
	 var dds =  show_dialog(csvpath,csvfilename);
	 if (dds['Exit']=='Yes')
	 { 
      //  alert($.fileName);

		//alert(myScriptPath);
		 return;
	 }
	/*
    var f1=0;
	var res = confirm("Yes - по файлам, No - все в один файл", true, "Что делать?");
        if (res == true) 
		{ 
			f1=1;
			var res_ftype = confirm("Yes - pdf, No - png", true, "Что делать?");
			if (res_ftype != true) out_file_type = 'png';
		}
	
	var f2=0;
	if(out_file_type == 'pdf')
		{
			res = confirm("Текст в кривые ? ", true, "Что делать?");
			if (res == true) { f2=1;}
		}
		
	var f3=0;
	if(f1==0)
		{
			res = confirm("YES - в ряд, No - в столбик", true, "Что делать?");
			if (res == true) { f3=1;}		
        }
		*/
	
	// page size in points 
	var fX=85;
	var fY=280;
	
    var thisDoc = app.documents.add(null,fX,fY);
	//thisDoc.views[0].zoom = 100;
    app.documents[1].activate();

    var csvRules;
    csvRules = File(script_path + rulesfilename);
    var csvTask;
    csvTask = File(csvpath + csvfilename);


    if (!csvRules.exists){ alert(csvRules + ' not exist'); return;}
    if (!csvTask.exists) { alert(csvTask+'  not exist');   return;}
   var fRules = Csv2Array(csvRules);
   var fTask = Csv2Array(csvTask);

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
   var pt2mm = 2.83464567;
   var dx = 70;//700
    var dy = 70;//700
	
   var x1 = -8020;
   var y1 = 50;

   
   /* 
   // big export
   var myTextFrame;
   var x2 = -8000;
   var y2 = 190;	
	*/
	
	
   var x1 = 120;
   var y1 = 50;

   var myTextFrame;
   var x2 = 100;
   var y2 = 190;

   
   
   
	var ii = 1.0;
	
	
   for (var i in t) 
   {

	   
			   app.activeDocument.layers[t[i][0]].layers[t[i][9]].visible = true;
			   setActiveArtboardBy(t[i][7]); // 7 - имя листа (Artboard name)
			   app.activeDocument.selectObjectsOnActiveArtboard();
			   
			   app.copy();
			   app.activeDocument.selection = null;
			   app.activeDocument.layers[t[i][0]].layers[t[i][9]].visible = false;
			   
			   app.documents[1].activate();//active=true;

			   if(dds['ToOneFile']=='Yes'){
				   
				   
				   if(t[i][8]!=0 || t[i][8]!="")
				   {
					   myTextFrame = app.activeDocument.textFrames.add();
					   myTextFrame.position = [x2, y2];
					   myTextFrame.contents = t[i][8] + ' шт.';
				   }

					   app.activeDocument.views[0].centerPoint = Array(x1, y1);
					   //alert(t[i][5]);
					   
					   
					   
					   dx = Number(t[i][5])*pt2mm; // convert mm to points
					   dy =  Number(t[i][6])*pt2mm + 40; // convert mm to points + points
					   
					  // располагать наклейки в ряд 
					 if(dds['LayerToRow']=='Yes' ){  
					   

					   
					   //alert (ii%max_row);
					   if (ii%max_row==0)
					   {
						 y1-= dy;
					     y2-= dy;
						
						x1=x1 - dx * (max_row -1) ;
						x2=x2 - dx * (max_row -1 );
						 
						   
					   }
					   else{
						x1 +=dx; //t[i][5];//dx;
					    x2 +=dx;//t[i][5]; //dx;
						   
					   }
					   
					   
					 }
					 else { // располагать наклейки в столбик
					   
					   y1+= dy;
					   y2+= dy; 
					 }
					 
					 
					 
				}	   
			   app.paste();
			   app.activeDocument.selection = null;
			   ii++;
			   
			   
			  // преобразовать текст в кривые? 
			   if(dds['TextToCurves']=='Yes')ExplodeAllText(app.activeDocument);
			   
			   if(dds['ToOneFile']=='No'){
				   Save2PdfNClose(app.activeDocument, exportpath + t[i][2],dds['ToPdf']);
				   app.documents.add(null,fX,fY);
				   //app.activeDocument.zoom = 100;
				   }
			   app.documents[1].activate();
   }
 alert("that's all.");
}








function show_dialog(csvpath,csvfilename)
{
	

	var box = new Window('dialog', "Some title");  
	var ds = new Array();
  ds[0]='-nothing-';
  
		box.panel = box.add('panel', undefined, "Путь и имя файла данных");  
		box.panel.csvpath = box.panel.add('edittext', undefined, csvpath);  
		box.panel.csvfilename = box.panel.add('edittext', undefined, csvfilename); 
		box.panel.orientation='row'; 
		// ------------------------------------------------------------------------------------		   
		 box.TextToCurves = box.add('group', undefined, 'Path Objects Size:');
		 box.TextToCurves = box.add('panel', undefined, "Текст в кривые ?"); 
			// Radio Buttons for Larger than, or smaller than
			(box.TextToCurves.Yes = box.TextToCurves.add('radiobutton', undefined, 'Да' )).helpTip = "text2curves"; 
			(box.TextToCurves.No = box.TextToCurves.add('radiobutton', undefined, 'Нет' )).helpTip = "text2text"; 

			box.TextToCurves.Yes.value = true; 
			box.TextToCurves.orientation='row'; 		  
		  
		// ------------------------------------------------------------------------------------			  
		  
		 box.ToOneFile = box.add('group', undefined, 'Path Objects Size:');
		 box.ToOneFile = box.add('panel', undefined, "Все слои в один файл?"); 
			// Radio Buttons for Larger than, or smaller than
			(box.ToOneFile.Yes = box.ToOneFile.add('radiobutton', undefined, 'Да' )).helpTip = "one file"; 
			(box.ToOneFile.No = box.ToOneFile.add('radiobutton', undefined, 'Нет' )).helpTip = "many files"; 

			box.ToOneFile.Yes.value = true; 
			box.ToOneFile.orientation='row'; 
			
		// ------------------------------------------------------------------------------------				
		 box.ToPdf = box.add('group', undefined, 'Path Objects Size:');
		 box.ToPdf = box.add('panel', undefined, "Экспорт в ?"); 
			// Radio Buttons for Larger than, or smaller than
			(box.ToPdf.Pdf = box.ToPdf.add('radiobutton', undefined, 'Pdf' )).helpTip = "2pdf"; 
			(box.ToPdf.Png = box.ToPdf.add('radiobutton', undefined, 'Png' )).helpTip = "2png"; 

			box.ToPdf.Pdf.value = true; 
			box.ToPdf.orientation='row'; 			
			
		// ------------------------------------------------------------------------------------				
		 box.LayerToRow = box.add('group', undefined, 'All to row:');
		 box.LayerToRow = box.add('panel', undefined, "Все слои в ряд?"); 
			// Radio Buttons for Larger than, or smaller than
			(box.LayerToRow.Yes = box.LayerToRow.add('radiobutton', undefined, 'Да' )).helpTip = "layers2row"; 
			(box.LayerToRow.No = box.LayerToRow.add('radiobutton', undefined, 'Нет' )).helpTip = "layers2column"; 

			box.LayerToRow.Yes.value = true; 
			box.LayerToRow.orientation='row'; 			
			
		// ------------------------------------------------------------------------------------	
		
		box.btns = box.add('group', undefined, 'buttons');
	  //  box.btns = box.add('panel', undefined, "___"); 

		box.btns.closeBtn=box.btns.add('button',undefined, "Start", {name:'close'});  
		box.btns.exitBtn=box.btns.add('button',undefined, "Exit", {name:'exit'});  
		box.btns.orientation='row'; 	
		
		
		
		box.btns.exitBtn.onClick = function(){ 
		ds['Exit']='Yes';
		box.close();

		}
		
		  
		box.btns.closeBtn.onClick = function(){ 
		
		
		if(box.ToOneFile.Yes.value == true)ds['ToOneFile']='Yes';
		if(box.ToOneFile.No.value == true)ds['ToOneFile']='No';	
		if(box.TextToCurves.Yes.value == true)ds['TextToCurves']='Yes';
		if(box.TextToCurves.No.value == true)ds['TextToCurves']='No';	
		if(box.ToPdf.Pdf.value == true)ds['ToPdf']='pdf';
		if(box.ToPdf.Png.value == true)ds['ToPdf']='png';			
		if(box.LayerToRow.Yes.value == true)ds['LayerToRow']='Yes';
		if(box.LayerToRow.No.value == true)ds['LayerToRow']='No';	
		ds['Exit']='No';

		
		ds['csvpath']=box.panel.csvpath.text;
		ds['csvfilename']=box.panel.csvfilename.text;
		  box.close();  
		}  
    box.show();
		
   return ds;

	
}















function doesLayerExist(name) {
	var layers=app.activeDocument.layers;
    for (i=0; i<layers.length; i++) {
        if (layers[i].name==name) return true;
    }
    return false;
}



// преобразовать текст в кривые
function ExplodeAllText(doc)
{
	   tfs = doc.textFrames;
	do{
	   if(tfs.length>=1)tfs[0].createOutline();
		else break;
	}while(tfs.length);
	
	
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


function Save2PdfNClose(doc,fn,out_file_type1)
{
// Create the illusrtratorSaveOptions object to set the AI options
        
		if(out_file_type1 == 'pdf')
		{
			var saveOpts = new IllustratorSaveOptions();
			
			var saveName = new File ( fn+".pdf" );
				// Setting IllustratorSaveOptions properties. 
				saveOpts.embedLinkedFiles = true;
				saveOpts.fontSubsetThreshold = 0.0
				saveOpts.pdfCompatible = true	  
				saveOpts = new PDFSaveOptions();
				saveOpts.compatibility = PDFCompatibility.ACROBAT5;
				saveOpts.generateThumbnails = true;
				saveOpts.preserveEditability = true;
			doc.saveAs( saveName, saveOpts );
			doc.close(SaveOptions.DONOTSAVECHANGES);
		}
		
		
		 if (out_file_type1 == 'png')
		{
			var saveName = new File ( fn+".png" );
			file = new File(saveName);
			var saveOpts = new ExportOptionsPNG24();
				saveOpts.antiAliasing = true;
				saveOpts.transparency = true;
				saveOpts.artBoardClipping = true;
				saveOpts.verticalScale = 600/doc.width*100;
				saveOpts.horizontalScale = 600/doc.width*100;
			
            doc.exportFile(file, ExportType.PNG24, saveOpts);
			doc.close(SaveOptions.DONOTSAVECHANGES);
			
		}
		
		
		
}




function ToPdf() {
    var doc = app.activeDocument;

    if (documents.length > 0) {

        // Create the illusrtratorSaveOptions object to set the AI options
        var saveOpts = new IllustratorSaveOptions();

        // Setting IllustratorSaveOptions properties. 
        saveOpts.embedLinkedFiles = true;
        saveOpts.fontSubsetThreshold = 0.0
        saveOpts.pdfCompatible = true


        //  if (doc.saved==false) doc.save();

        //   for (i=0; i<doc.layers.length; i++)
        //       if (doc.layers[i].locked == false) doc.layers[i].visible = false;
        fullDocName = doc.fullName;
        var param = doc.name.split('.');
        realDocName = param[0];
        var ilayer = doc.activeLayer;

        /* var idoc = app.activeDocument;  
        var ilayer = idoc.activeLayer;  
        for (i=0; i<ilayer.layers.length; i++) {  
            var isublayer = ilayer.layers[i];  
            isublayer.name = isublayer.pageItems[0].name;  
        }   */

        //   var isublayer = ilayer.layers[i];		
        //alert(ilayer.name);
        var activeAB = doc.artboards[doc.artboards.getActiveArtboardIndex()]; // get active AB  
        var docLeft = activeAB.artboardRect[0];
        var docTop = activeAB.artboardRect[1];

        for (i = 0; i < ilayer.layers.length; i++) {
            /*             if (i-1<0) ilayer.layers[i].visible = true;
                        else {
                            ilayer.layers[i-1].visible = false;
                            ilayer.layers[i].visible = true;
                        } */
            if (ilayer.layers[i].locked == false && ilayer.layers[i].visible == false) {

                ilayer.layers[i].visible == true;

                var xx = [doc.selection.bounds[0].docLeft, doc.selection.bounds[1].docTop];

                alert(ilayer.layers[i].name + '<<>>' + xx.length);
                ilayer.layers[i].visible == false;

                // docName = realDocName+doc.layers[i].name+".pdf";    
                // var saveName = new File ( doc.path + "/" + docName );

                // saveOpts = new PDFSaveOptions();
                // saveOpts.compatibility = PDFCompatibility.ACROBAT5;
                // saveOpts.generateThumbnails = true;
                // saveOpts.preserveEditability = true;
                // doc.saveAs( saveName, saveOpts );
            }
        }
        // doc.close(SaveOptions.DONOTSAVECHANGES);
        // doc = null;
        // app.open (fullDocName);
    }

}
/////////End