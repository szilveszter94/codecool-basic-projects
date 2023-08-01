const render = (content, className = "") => {
  switch (typeof content) {
    case "object":

      return Array.isArray(content) ? `<div class="${className}">${ content.map((e) => render(e)).join("") }</div>` : `<div class="${className}">${Object.keys(content).map(e => render(content[e], e)).join("")}</div>`;
      
 
    default:
      return `<div class="${className}">${content}</div>`
  }
}

const postError = async msg => {
  //console.log(msg);

  fetch("/error", {
    method: 'post',
    body: msg
  })
  .then((r) => {
    if (r.status === 200) {
      //console.log("The Error message sent");
    }
  })
  .catch((error) => {
    console.log('Request failed', error);
  });

}

const pImp = to => to.reduce((p,c) => {
    const o = {};
    const key = c.name;
    const value = c.content;
    o[key] = value;
    return {...p, ...o};
  }, {});


export { render, postError, pImp };