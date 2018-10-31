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
            val: 5,
            group: "virtual",
            type: "virtual"            
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
        val: (lab.rows * lab.columns) / 10,
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
        val: 5,
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
    return data;   
  }
};

export default Graph;