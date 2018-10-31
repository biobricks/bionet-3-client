const Graph = {
  "getOverview": (users, labs, virtuals, containers, physicals) => {
    let data = {
      nodes: [],
      links: []
    };
    // users
    for(let i = 0; i < users.length; i++){
      let user = users[i];
      let userNode = {
        id: user._id,
        name: `User: ${user.username}`,
        val: 5,
        group: "user",
        type: "user"
      };
      data.nodes.push(userNode);
      // virtuals by creator
      for(let j = 0; j < virtuals.length; j++){
        let virtual = virtuals[j];
        if (virtual.creator._id === user._id) {
          let virtualNode = {
            id: virtual._id,
            name: `Virtual Sample: ${virtual.name}`,
            val: 15,
            group: "Virtual",
            type: "Virtual"            
          };
          // virtual to creator
          let creatorLink = {
            name: `Virtual Sample ${virtual.name} created by ${user.username}`,
            source: user._id,
            target: virtual._id
          };
          data.nodes.push(virtualNode);
          data.links.push(creatorLink);
        }

      }
    }
    // labs
    for(let i = 0; i < labs.length; i++){
      let lab = labs[i];
      let labNode = {
        id: lab._id,
        name: `${lab.name} - ${lab.users.length} ${lab.users.length !== 1 ? 'members' : 'member'}`,
        val: 60,
        group: lab._id,
        type: 'lab'
      };
      data.nodes.push(labNode);
      // labs to member users
      for(let j = 0; j < lab.users.length; j++){
        let labUser = lab.users[j];
        let userLabLink = {
          name: `${labUser.username} belongs to ${lab.name}`,
          source: labUser._id,
          target: lab._id
        };
        data.links.push(userLabLink);
      }
      // labs to other labs
      for(let j = 0; j < labs.length; j++){
        let otherLab = labs[j];
        if (otherLab._id !== lab._id) {
          let labLabLink = {
            name: `${lab.name} networks with ${otherLab.name} via BioNet`,
            source: lab._id,
            target: otherLab._id
          };
          data.links.push(labLabLink);
        }
      }
    } 
    // containers
    for(let i = 0; i < containers.length; i++){
      let container = containers[i];
      let containerNode = {
        id: container._id,
        name: `Container: ${container.name}`,
        val: container.parent !== null ? 7 : 15,
        group: container.lab._id,
        type: "Container"            
      };
      data.nodes.push(containerNode);
      // container to lab/parent container
      let parentLink = container.parent !== null ? {
        name: `Container: ${container.name} is inside of Container: ${container.parent.name}`,
        source: container.parent._id,
        target: container._id
      } : {
        name: `Container: ${container.name} is inside of Lab: ${container.lab.name}`,
        source: container.lab._id,
        target: container._id
      };
      data.links.push(parentLink); 
    }
    // physicals
    for(let i = 0; i < physicals.length; i++){
      let physical = physicals[i];
      let physicalNode = {
        id: physical._id,
        name: `Physical: ${physical.name}`,
        val: 3,
        group: "Physical",
        type: "Physical"            
      };
      data.nodes.push(physicalNode);
      // physical to lab/parent container
      let parentLink = physical.parent !== null ? {
        name: `Physical: ${physical.name} is inside of Container: ${physical.parent.name}`,
        source: physical.parent._id,
        target: physical._id
      } : {
        name: `Physical: ${physical.name} is inside of Lab: ${physical.parent.lab.name}`,
        source: physical.parent.lab._id,
        target: physical._id
      };
      data.links.push(parentLink);
      // physical to creator
      let creatorLink = {
        name: `Physical Sample ${physical.name} created by ${physical.creator.username}`,
        source: physical.creator._id,
        target: physical._id
      };
      data.links.push(creatorLink);
    }    
    return data;   
  }
};

export default Graph;