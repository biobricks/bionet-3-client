const Graph = {
  "getOverview": (users, labs, virtuals) => {
    let data = {
      nodes: [],
      links: []
    };
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
      for(let j = 0; j < virtuals.length; j++){
        let virtual = virtuals[j];
        if (virtual.creator._id === user._id) {
          let virtualNode = {
            id: virtual._id,
            name: `Virtual: ${virtual.name}`,
            val: 5,
            group: "virtual",
            type: "virtual"            
          };
          let creatorLink = {
            source: user._id,
            target: virtual._id
          };
          data.nodes.push(virtualNode);
          data.links.push(creatorLink);
        }
      }
    }
    for(let i = 0; i < labs.length; i++){
      let lab = labs[i];
      let labNode = {
        id: lab._id,
        name: lab.name,
        val: (lab.rows * lab.columns) / 10,
        group: lab._id,
        type: 'lab'
      };
      data.nodes.push(labNode);
      for(let j = 0; j < lab.users.length; j++){
        let labUser = lab.users[j];
        let userLabLink = {
          source: labUser._id,
          target: lab._id
        };
        data.links.push(userLabLink);
      }
      for(let j = 0; j < labs.length; j++){
        let otherLab = labs[j];
        if (otherLab._id !== lab._id) {
          let labLabLink = {
            source: lab._id,
            target: otherLab._id
          };
          data.links.push(labLabLink);
        }
      }
    } 
    return data;   
  }
};

export default Graph;