# csv2xml
Convert each row in a csv file to xml as defined by a custom schematic.  
Released under the MIT license.  
[Live version](http://ep-nuffic.github.io/csv2xml/).

##Limitations
* Separator must be a **semicolon**
* Fields that contain semicolons must be delimited with **double quotes**
* Field names cannot contain non-letter characters.
* [[CREATIONDATETIME]] is hard-coded to give datetime in format YYYY-MM-DDThh:mm:ss
* No warnings or errors of any kind
* Text in XML template between <!--REPEAT--> and <!--ENDREPEAT--> is repeated for every line in the CSV document.
