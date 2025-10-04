
const msgInput = document.getElementById("messageInput");
const messages = []




async function llm_call(messages){
  
}


function addToUI(){
  let msgContainer = document.getElementById("messageContainer");
  let newDiv = document.createElement("div");
  if (msgInput.value == "") return;
  newDiv.innerHTML = `<div class="flex ${message.role == "user" ? "justify-end" : "justify-start"}">
          <div class="max-w-[80%] rounded-lg px-4 py-3 ${
            message.role == "user" ? `bg-[#444654]` : ""
          } text-gray-100">
            <p class="text-[16px">${msgInput.value}</p>
          </div>
        </div>`;
  msgContainer.appendChild(newDiv);
  msgInput.value = "";
}


msgInput.addEventListener("keyup",(event) => {
    if(event.key === "Enter"){
      addToUI()
      llm_call()
    }
})

const sendBtn = document.getElementById("sendButton")
sendBtn.addEventListener("click" , () => {
  addToUI()
  llm_call()
})
