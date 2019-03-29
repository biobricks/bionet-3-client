export const getItemById = function getItemById(id, containers, physicals) {
  let result = null;
  for(let i = 0; i < containers.length; i++){
    let childContainer = containers[i];
    if (childContainer._id === id) {
      result = childContainer;
    }
  }
  for(let i = 0; i < physicals.length; i++){
    let childPhysical = physicals[i];
    if (childPhysical._id === id) {
      result = childPhysical;
    }
  }
  return result;
}

export const getChildren = function getChildren(record) {
  const recordExists = record && Object.keys(record).length > 0;
  const recordChildrenExist = recordExists && Object.keys(record).indexOf('children') > -1;
  const recordContainersExist = recordChildrenExist && Object.keys(record.children).indexOf('containers') > -1;
  const recordPhysicalsExist = recordChildrenExist && Object.keys(record.children).indexOf('physicals') > -1;
  let result = {};
  result.containers = recordExists && recordChildrenExist && recordContainersExist ? record.children.containers : [];
  result.physicals = recordExists && recordChildrenExist && recordPhysicalsExist ? record.children.physicals : [];  
  return result;
}

export const getLocations = function getLocations(record, containers, physicals) {
  // full cells
  let fullCellArray = [];
  // add record containers
  for(let i = 0; i < containers.length; i++){
    const container = containers[i];
    const { row, rowSpan, column, columnSpan } = container;
    const position = [row,column];
    let containerPositions = [position];
    // for(let rowSpanNo = 1; rowSpanNo <= rowSpan; rowSpanNo++){
    //   if (rowSpanNo !== 1) {
    //     let rowPos = row + rowSpanNo - 1;
    //     containerPositions.push([rowPos, column]);
    //   }  
    // }
    // for(let colSpanNo = 1; colSpanNo <= columnSpan; colSpanNo++){
    //   if (colSpanNo !== 1) {
    //     let colPos = column + colSpanNo;
    //     containerPositions.push([row, colPos]);
    //   }
    // }    
    for(let rowSpanNo = 1; rowSpanNo <= rowSpan; rowSpanNo++){
      if (rowSpanNo !== 1) {
        let rowPos = row + rowSpanNo - 1;
        containerPositions.push([rowPos, column]);
      }  
    }
    for(let colSpanNo = 1; colSpanNo <= columnSpan; colSpanNo++){
      if (colSpanNo !== 1) {
        let colPos = column + colSpanNo - 1;
        containerPositions.push([row, colPos]);
      }
    }  
    fullCellArray = containerPositions.concat(fullCellArray);
  }
  //console.log('full cell array after containers', fullCellArray);

  // add record physicals
  for(let i = 0; i < physicals.length; i++){
    const physical = physicals[i];
    const { row, rowSpan, column, columnSpan } = physical;
    const position = [row,column];
    let physicalPositions = [position];
    for(let rowSpanNo = 1; rowSpanNo <= rowSpan; rowSpanNo++){
      if (rowSpanNo !== 1) {
        let rowPos = row + rowSpanNo - 1;
        physicalPositions.push([rowPos, column]);
      }  
    }
    for(let colSpanNo = 1; colSpanNo <= columnSpan; colSpanNo++){
      if (colSpanNo !== 1) {
        let colPos = column + colSpanNo - 1;
        physicalPositions.push([row, colPos]);
      }
    }
    fullCellArray = physicalPositions.concat(fullCellArray);
  }
  console.log('full cell array after physicals', fullCellArray);

  // empty cells
  let emptyCellArray = [];
  let recordRows = record ? record.rows : [];
  let recordColumns = record ? record.columns : [];
  for(let rowNo = 1; rowNo <= recordRows; rowNo++){
    for(let colNo = 1; colNo <= recordColumns; colNo++){
      const position = [rowNo, colNo];
      let positionFull = false;
      for(let i = 0; i < fullCellArray.length; i++){
        const fullCell = fullCellArray[i];
        const rowMatches = fullCell[0] === rowNo;
        const columnMatches = fullCell[1] === colNo;
        const isMatch = rowMatches && columnMatches;
        if (isMatch) { positionFull = true } 
      }
      if (!positionFull) {
        emptyCellArray.push(position);
      } else {
        //console.log(`position ${position[0]}, ${position[1]} full`);
      }
    }
  }

  // set locations
  const locations = {
    empty: emptyCellArray,
    full: fullCellArray
  };
  //console.log('locations', locations);

  return locations;
}

export const LabHelpers = { getItemById, getChildren, getLocations };