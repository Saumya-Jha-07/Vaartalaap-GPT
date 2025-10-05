
const msgInput = document.getElementById("messageInput");




async function callServer(userMsg){
    const response = await fetch('http://localhost:3000' , {
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
    return result.message;
}


function addToUI(role , text){
  let msgContainer = document.getElementById("messageContainer");
  let newDiv = document.createElement("div");
  if (msgInput.value == "") return;
  newDiv.innerHTML = `<div class="flex ${role == "user" ? "justify-end" : "justify-start"}">
          <div class="max-w-[80%] rounded-lg px-4 py-3 ${
            role == "user" ? `bg-[#444654]` : ""
          } text-gray-100">
            <p class="text-[16px">${text}</p>
          </div>
        </div>`;
  msgContainer.appendChild(newDiv);
  msgInput.value = "";
}


msgInput.addEventListener("keyup",async (event) => {
    if(event.key === "Enter"){
      addToUI("user", msgInput.value);
      const llm_res = await callServer(msgInput.value);
      addToUI("assisstant" , llm_res)
    }
})

const sendBtn = document.getElementById("sendButton")
sendBtn.addEventListener("click" , async () => {
  addToUI("user", msgInput.value);
  const llm_res = await callServer(msgInput.value);
  addToUI("assisstant" , llm_res);
})
