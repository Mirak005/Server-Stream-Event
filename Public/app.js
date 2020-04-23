function sse() {
  let eventSource = new EventSource(`http://localhost:5000/sse`);
  eventSource.addEventListener("message", e => {
    updateData(JSON.parse(e.data));
  });
}

function updateData(event) {
  const values = Array.from(document.querySelectorAll("div h3"));
  for (let el of values) {
    let i = values.indexOf(el);
    el.innerText = event[`sub${i + 1}`];
  }
}

function myData() {
  const values = Array.from(document.querySelectorAll("div h3"));
  let res = {};
  //create object data
  values.forEach(
    (el, i) => (res = { ...res, [`sub${i + 1}`]: Number(el.innerText) })
  );
  return res;
}

async function subData() {
  const config = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(myData())
  };

  try {
    await fetch("/sub", config);
  } catch (error) {
    console.error(error);
  }
}

//Add event on buttons
let buttons = Array.from(document.getElementsByTagName("button"));
for (let btn of buttons) {
  btn.addEventListener("click", e => {
    e.target.nextElementSibling.innerText++;
    subData();
  });
}

//lunch steam server event
sse();
