export const getSpanMax = function getSpanMax(form, newItemLocations, locations, parentRecord) {
  try {
    // get new location
    const newItemLocation = newItemLocations && newItemLocations.length > 0 ? newItemLocations[0] : null;
    const newRow = newItemLocation !== null ? newItemLocation[0] : null;
    const newColumn = newItemLocation !== null ? newItemLocation[1] : null;  
    // determine length from new location to end of container
    const rowSpanAvailable = parentRecord.rows - newRow + 1;
    const columnSpanAvailable = parentRecord.columns - newColumn + 1;
    // set span max to full space available pending conflict validation
    let rowSpanMax = rowSpanAvailable;
    let columnSpanMax = columnSpanAvailable;
    
    // check every row in the column selected
    for(let potRow = newRow; potRow <= rowSpanAvailable; potRow++){
      // the potential location
      let potentialLocation = [potRow, newColumn];
      // conflict flags
      let conflictExists = false;
      let spanConflictExists = false;
      // check every full cell
      for(let i = 0; i < locations.full.length; i++){
        // the full cell location
        let fullLocation = locations.full[i];
        // check if the potential location is already full
        let locationIsFull = fullLocation[0] === potentialLocation[0] && fullLocation[1] === potentialLocation[1];
        if (locationIsFull){ conflictExists = true }
        
        // establish column span range from potential location
        let maxColumn = newColumn + form.columnSpan - 1;
        //console.log('max row', maxRow);
        
        // check every cell within the range for conflict
        for(let rangeCol = newColumn; rangeCol <= maxColumn; rangeCol++){
          let rangeLocation = [potRow, rangeCol];
          //console.log(i, j, potentialLocation)
          let spanLocationIsFull = fullLocation[0] === rangeLocation[0] && fullLocation[1] === rangeLocation[1];
          if (spanLocationIsFull){ spanConflictExists = true }
        }        
      }
      const prevRow = potRow - 1;
      if (conflictExists) { rowSpanMax = prevRow }
      if (spanConflictExists) { rowSpanMax = prevRow }
    }

    // check every column in the row selected 
    for(let potColumn = newColumn; potColumn <= columnSpanAvailable; potColumn++){
      // the potential location
      let potentialLocation = [newRow, potColumn];
      // conflict flags
      let conflictExists = false;
      let spanConflictExists = false;
      // check every full cell
      for(let i = 0; i < locations.full.length; i++){
        // the full cell location
        let fullLocation = locations.full[i];
        // check if the potential location is already full
        let locationIsFull = fullLocation[0] === potentialLocation[0] && fullLocation[1] === potentialLocation[1];
        if (locationIsFull){ conflictExists = true }
        
        // establish row span range from potential location
        let maxRow = newRow + form.rowSpan - 1;
        //console.log('max row', maxRow);
        
        // check every cell within the range for conflict
        for(let rangeRow = newRow; rangeRow <= maxRow; rangeRow++){
          let rangeLocation = [rangeRow, potColumn];
          //console.log(i, rangeRow, potentialLocation)
          let spanLocationIsFull = fullLocation[0] === rangeLocation[0] && fullLocation[1] === rangeLocation[1];
          if (spanLocationIsFull){ spanConflictExists = true }
        }
      } 
      const prevColumn = potColumn - 1;
      if (conflictExists) { columnSpanMax = prevColumn }
      if (spanConflictExists) { columnSpanMax = prevColumn - 1}
    }    
    return { rowSpanMax, columnSpanMax }
  } catch (error) {
    throw error;
  }  
}