export const getSpanMax = (form, newItemLocations, locations, parentRecord) => {
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

    // check every row in the column selected for end or conflict to set max
    for(let potRow = newRow; potRow <= rowSpanAvailable; potRow++){
      // the potential location
      let potentialLocation = [potRow, newColumn];
      // conflict flags
      let conflictExists = false;
      // is the potential location already occupied
      const potentialLocationOccupied = locationExistsInArray(potentialLocation, locations.full);
      
      // if occupied flag conflict
      if (potentialLocationOccupied) { conflictExists = true }
      // previous row no
      const prevRow = potRow - 1;
      // if conflict then set max to last valid value
      if (conflictExists) { rowSpanMax = prevRow }
    }

    // check every column in the row selected for end or conflict to set max
    for(let potColumn = newColumn; potColumn <= columnSpanAvailable; potColumn++){
      // the potential location
      let potentialLocation = [newRow, potColumn];
      // conflict flags
      let conflictExists = false;
      // is the potential location already occupied
      const potentialLocationOccupied = locationExistsInArray(potentialLocation, locations.full);
      // if occupied flag conflict
      if (potentialLocationOccupied) { conflictExists = true }
      // previous column no
      const prevColumn = potColumn - 1;
      // if conflict then set max to last valid value
      if (conflictExists) { columnSpanMax = prevColumn }
    }



    return { rowSpanMax, columnSpanMax }
  } catch (error) {
    throw error;
  }  
}

export const locationExistsInArray = (locQuery, locArray) => {
  try {
    let locExists = false;
    for(let i = 0; i < locArray.length; i++){
      const loc = locArray[i];
      if (loc[0] === locQuery[0] && loc[1] === locQuery[1]) { locExists = true }
    }
    return locExists;
  } catch (error) {
    throw error;
  }  
}

export const getLocationRange = (loc, rowSpan, columnSpan, inForm=false, field="") => {
  try {
    const rowMin = loc[0];
    const rowMax = inForm && field === 'rowSpan' ? (rowMin + rowSpan) : (rowMin + rowSpan - 1);
    const columnMin = loc[1];
    const columnMax = inForm && field === 'columnSpan' ? (columnMin + columnSpan) : (columnMin + columnSpan - 1);
    let locationRange = [];
    for(let rowNo = rowMin; rowNo <= rowMax; rowNo++){
      for(let columnNo = columnMin; columnNo <= columnMax; columnNo++){
        locationRange.push([rowNo, columnNo]);
      }
    }
    return locationRange;
  } catch (error) {
    throw error;
  }  
}