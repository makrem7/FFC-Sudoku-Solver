class SudokuSolver {
  constructor(puzzleString, row, column, value) {
    this.puzzleString=puzzleString;
    this.row = row;
    this.column = column;
    this.value = value 
  }

  validate() {
    
    if (this.puzzleString==='' || this.puzzleString===undefined){ 
      if(this.row !== undefined || this.column !== undefined || this.value !== undefined){
        return {
          "error": "Required field(s) missing"          
        }
      }
      else {
        return {
          "error": "Required field missing"        
        }
      }  
    }
    
    if ((this.row === '' || this.row===undefined )&& (this.column !== undefined || this.value !== undefined)){      
      return {
        "error": "Required field(s) missing"        
      }
    } 
    if ((this.column === ''|| this.column===undefined ) && (this.row !== undefined || this.value !== undefined)){            
      return {
        "error": "Required field(s) missing"        
      }
    } 

    if ((this.value === ''|| this.value ===undefined) && (this.row !== undefined || this.column !== undefined)){      
      return {
        "error": "Required field(s) missing"        
      }
    } 

    if (this.puzzleString.length!==81){
      return {
        "error": "Expected puzzle to be 81 characters long"
      }
    }    
    if(!this.puzzleString.match(/^[\d .]+$/g)){
      return {
        "error": "Invalid characters in puzzle"
      }
    }

    if(this.row !== undefined && !this.row.match(/[a-i]|[A-I]$/)){
        return {
          "error": "Invalid coordinate"
      }
    }
    if(this.column!==undefined && !this.column.match(/[1-9]$/)){    
      return {
        "error": "Invalid coordinate"
      }
    }

    if(this.value!==undefined && !this.value.match(/[1-9]$/)){      
      return {
        "error": "Invalid value"
      }
    }

    else {
      // unfortunately false because send error back leads to true
      return false;
    }
  }
 
  checkRowPlacement() {
    const rows = ['A','B','C','D','E','F','G','H','I'];
    let startValue = rows.indexOf(this.row) * 9;
    let endValue = startValue + 9;
    let choppedString = this.puzzleString.slice(startValue,endValue);
    
    if (Array.from(choppedString).indexOf(this.value)=='-1'){
      return true;
    } else {
      return false;
    }
  }

  checkColPlacement() {
    let puzzleArray = Array.from(this.puzzleString);
    let newArray =[];    
    let startIndex = Number(this.column)-1;

    for (let i=0; i<9; i++){      
      newArray.push(puzzleArray[startIndex+i*9]);
    }

    if (newArray.indexOf(this.value)=='-1'){
      return true;
    } else {
      return false;
    }
  }

  checkRegionPlacement() {
    let puzzleArray = Array.from(this.puzzleString);
    let rows = ['A','B','C','D','E','F','G','H','I'];
    let newArray=[];    
    
    const box1 =['0','1','2','9','10','11','18','19','20'];
    const box2 =['3','4','5','12','13','14','21','22','23'];
    const box3 =['6','7','8','15','16','17','24','25','26'];
    const box4 =['27','28','29','36','37','38','45','46','47'];
    const box5 =['30','31','32','39','40','41','48','49','50'];
    const box6 =['33','34','35','42','43','44','51','52','53'];
    const box7 =['54','55','56','63','64','65','72','73','74'];
    const box8 =['57','58','59','66','67','68','75','76','77'];
    const box9 =['60','61','62','69','70','71','78','79','80'];

    let indexNum = rows.indexOf(this.row) * 9 + Number(this.column)-1;
    if (box1.includes(indexNum.toString())){
      for (let i=0; i<9; i++){
        newArray.push(puzzleArray[Number(box1[i])]);       
      }
    }
    else if (box2.includes(indexNum.toString())){
      for (let i=0; i<9; i++){
        newArray.push(puzzleArray[Number(box2[i])]);       
      }
    }
    else if (box3.includes(indexNum.toString())){
      for (let i=0; i<9; i++){
        newArray.push(puzzleArray[Number(box3[i])]);       
      }
    }
    else if (box4.includes(indexNum.toString())){
      for (let i=0; i<9; i++){
        newArray.push(puzzleArray[Number(box4[i])]);       
      }
    }
    else if (box5.includes(indexNum.toString())){
      for (let i=0; i<9; i++){
        newArray.push(puzzleArray[Number(box5[i])]);       
      }
    }
    else if (box6.includes(indexNum.toString())){
      for (let i=0; i<9; i++){
        newArray.push(puzzleArray[Number(box6[i])]);       
      }
    }
    else if (box7.includes(indexNum.toString())){
      for (let i=0; i<9; i++){
        newArray.push(puzzleArray[Number(box7[i])]);       
      }
    }
    else if (box8.includes(indexNum.toString())){
      for (let i=0; i<9; i++){
        newArray.push(puzzleArray[Number(box8[i])]);       
      }
    }
    else if (box9.includes(indexNum.toString())){
      for (let i=0; i<9; i++){
        newArray.push(puzzleArray[Number(box9[i])]);       
      }
    } else {
      return false;
    }

    
    if (newArray.indexOf(this.value)=='-1'){
      return true;
    } else {
      return false;
    }
  }

  checkAll() {

    let rows = ['A','B','C','D','E','F','G','H','I'];
    let valueIndex = (rows.indexOf(this.row)*9)+Number(this.column)-1;    
    let puzzleArray = Array.from(this.puzzleString);

    //If value submitted to /api/check is already placed in puzzle on that coordinate, the returned value will be an object containing a valid property with true if value is not conflicting.
    if(this.value!==undefined && this.value===puzzleArray[valueIndex]){      
      puzzleArray[valueIndex]='.';
      this.puzzleString=puzzleArray.join("");
      console.log('coordinate already in use');
    }
    

    if (this.checkRowPlacement() && this.checkColPlacement() && this.checkRegionPlacement()){
      return true;
    } else {
      return false;
    };         
  }

         

  solve() {
    const rows = ['A','B','C','D','E','F','G','H','I'];
    const regionIndexArray = [['0','1','2','9','10','11','18','19','20'],['3','4','5','12','13','14','21','22','23'],['6','7','8','15','16','17','24','25','26'],['27','28','29','36','37','38','45','46','47'],['30','31','32','39','40','41','48','49','50'],['33','34','35','42','43','44','51','52','53'],['54','55','56','63','64','65','72','73','74'],['57','58','59','66','67','68','75','76','77'],['60','61','62','69','70','71','78','79','80']];
    var startingArray = Array.from(this.puzzleString);
    
    // we select only these index numbers which have to be replaced
    var undefindedIndexArray=[];
    for (let i=0; i<81; i++) {
      if(isNaN(startingArray[i])){ 
        undefindedIndexArray.push(i);
      } else {
        continue;
      }
    }
    
    // now for each undefined value we go through and check if a value starting by 1 until 9 is possible, if so we store it in startingArray
    for(let i=0; i<undefindedIndexArray.length;) {
      let strike = false;  //indicator if we have a match or not
      
      var newValue; // value we want to try next
      if(isNaN(startingArray[undefindedIndexArray[i]])){
        newValue = 1;
      } else {
        newValue = startingArray[undefindedIndexArray[i]]+1;
      }         
      let newRowNum = Math.trunc(undefindedIndexArray[i]/9);
      let newRow = rows[newRowNum];      
      let newCol = undefindedIndexArray[i]-newRowNum*9+1;      

      // when we have a match with newValue we replace . from starting index otherwise we increase value by 1 and do it again
      for (newValue;newValue<10 && !strike;){
        let test = new SudokuSolver(startingArray.join(""),newRow.toString(),newCol.toString(),newValue.toString());
        if (test.checkAll()){        
          strike = true;          
          startingArray[undefindedIndexArray[i]] = newValue;
          i++;
        } 
        else {
          strike = false;
          newValue++;      
        }
      }
      //if we did not find a suitable candidate for index to be replace, we have to go back to last replacement and find an alternative ==> bracktracing           
      if(!strike) {
        startingArray[undefindedIndexArray[i]] = 0;
        i--;        
      }
      //here we escape if we are running out of options and return false for unsolveable sodukos
      if(!strike && i===-1) {
        return false;        
      }

    }
    return startingArray.join("");
  }  
}

module.exports = SudokuSolver;

