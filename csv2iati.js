
// Returns creation date and time of the file in format YYYY-MM-DDThh:mm:ss
var datenow = function(){
  var date = new Date();
  var string = sprintf("%04d-%02d-%02dT%02d:%02d:%02d",
    date.getUTCFullYear(),
    date.getUTCMonth()+1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  return string;
}

// Turns csv into an array of objects
// Delimiter has to be semicolon for now.
var readcsv = function(csvtext){
  var csvdata=[];
  var lines = csvtext.split("\n");
  var headers = lines[0].split(';'); //headers cannot contain semicolons
  setTimeout(function(){ //1 second should be enough to populate the array
  for(var l=1; l<lines.length; l++){
    if (!lines[l]){ continue; } //don't create entries for empty lines
    var line = lines[l].match(/"(?:\\"|[^"])+";|[^;]*;|"(?:\\"|[^"])+"$|[^;]*$/g); //terrible regexp, but it doesn't match semicolons within DOUBLE quotes.
    var linedata = {};
    for(var c=0; c<headers.length; c++){
      if (line[c].slice(-1)==";"){ //if the last character is a semicolon, 
        line[c]=line[c].slice(0,-1); //remove it.
      }
      linedata[headers[c]]=line[c]; //add it to the object
    }
    csvdata.push(linedata); //add the object to the array
  }
  },1000);
  return csvdata;
}


//Turns the CSV into an XML as specified by the template
var makeXML = function(){
  $('button').attr('disabled','disabled'); //Disable the button so we can't press it again while this is running
  $('#output').val(""); //Clear the output field
  var output="";
  var match;
  
  var template = $('#template').val();
  var csvtext = $('#csv').val();
  var match = template.match(/^([\s\S]+)<!--REPEAT-->([\s\S]+)<!--ENDREPEAT-->([\s\S]+)$/); //only process data between the <!--REPEAT--> and <!--ENDREPEAT--> for every line.
  output += match[1].replace(/\[\[CREATIONDATETIME\]\]/,datenow()); //Add the header
  
  var csv = readcsv(csvtext);
  setTimeout(function() { //readcsv(.) should be done after 2 seconds
    for(var i=0; i<csv.length; i++){
      csvdata = csv[i];
      csvdata.CREATIONDATETIME = datenow(); // field CREATIONDATETIME is not pulled from the csv, but calculated.
      var match2;
      var remaining = match[2];
      while(match2 = remaining.match(/^([\s\S]+?)\[\[(\w+)\]\]([\s\S]+)$/)) { // while we can find fields to replace.
        output += match2[1]; //insert everything before the field
        var value = csvdata[match2[2]]; //insert the value of the field for the current row of the csv
        if(value){
          output += value.replace(/\&/g,"&amp;").replace(/\\n/g,"\n").replace(/</g,"&lt;").replace(/>/g,"&gt;"); //with some replacements necessary for XML
        }
        remaining = match2[3]; //repeat the loop for everything after the field
      }
      output += remaining; //add the rest, after the last field
    }
    setTimeout(function(){output+= match[3]; $('#output').val(output); $('button').removeAttr('disabled')}, 2000); //wait another 2 seconds before adding the xml string to the textarea
  },2000);
  
}

