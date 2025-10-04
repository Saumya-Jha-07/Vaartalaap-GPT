/*
  - assistant message : <div class="flex justify-start">
          <div class="max-w-[80%] rounded-lg px-4 py-3  text-gray-100">
            <p class="text-[16px]">Aur bhai , kya puchna hai puch ?</p>
          </div>
  
  - user message : <div class="flex justify-end">
          <div class="max-w-[80%] rounded-lg px-4 py-3 bg-[#444654] text-gray-100">
            <p class="text-[16px">${inp.value}</p>
          </div>
        </div>
*/




function addToUI(){
  let n =0;
  
  let input = document.getElementById("messageInput");
  let msgContainer = document.getElementById("messageContainer");
  let newDiv = document.createElement("div");
  if (input.value == "") return;
  newDiv.innerHTML = `<div class="flex ${n ? "justify-end" : "justify-start"}">
          <div class="max-w-[80%] rounded-lg px-4 py-3 ${n ? `bg-[#444654]` : ""} text-gray-100">
            <p class="text-[16px">${input.value}</p>
          </div>
        </div>`;
  msgContainer.appendChild(newDiv);
  input.value = "";
}

const msgInput = document.getElementById("messageInput");
msgInput.addEventListener("keyup",(event) => {
    if(event.key === "Enter"){
      addToUI()
    }
})

const sendBtn = document.getElementById("sendButton")
sendBtn.addEventListener("click" , addToUI)
