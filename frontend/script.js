
const msgInput = document.getElementById("messageInput");

const loading = document.createElement("div");
loading.innerHTML = `<div class="flex justify-start">
          <div class="max-w-[80%] rounded-lg px-4 py-3  text-gray-100">
            <p class="text-[16px] animate-pulse">Thinking...</p>
          </div>
        </div>`;


async function callServer(userMsg){
    const response = await fetch('http://localhost:3000/chat' , {
      method : "POST" , 
      headers : {
        'content-type' : 'application/json'
      },
      body : JSON.stringify({message : userMsg})
    })

    if(!response.ok){
      throw new Error("Error generating the response!")
    }

    const result = await response.json();
    console.log(`user : ${userMsg} \n bot : ${result.message}`)
    
    return result.message;
}

function addToUI(text,role,isThinking){  
  let msgContainer = document.getElementById("messageContainer");
  let newDiv = document.createElement("div");
  if (text == "") return;
  newDiv.innerHTML = `<div class="flex ${role == "user" ? "justify-end" : "justify-start"}">
          <div class="max-w-[80%] rounded-lg px-4 py-3 ${
            role == "user" ? `bg-[#444654]` : ""
          } text-gray-100">
            <p class="text-[16px">${text}</p>
          </div>
        </div>`;
  msgContainer.appendChild(newDiv);
  if(isThinking) {
    msgContainer.appendChild(loading);
  } else {
    msgContainer.removeChild(loading);
  }
  msgInput.value = "";
}


msgInput.addEventListener("keyup",async (event) => {
    if(event.key === "Enter"){
      let input = msgInput.value;
      if(!input) return ;
      addToUI(input, "user",true);
      const llm_res = await callServer(input);
      addToUI(llm_res,"assistant",false);
    }
  })
  
  const sendBtn = docum
  ent.getElementById("sendButton")
  sendBtn.addEventListener("click" , async () => {
    let input = msgInput.value;
    if(!input) return ;
  addToUI(input,"user",true);
  const llm_res = await callServer(input);
  addToUI(llm_res,"demo",false);
})
