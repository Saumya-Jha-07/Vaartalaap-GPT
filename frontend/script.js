

document.getElementById("messageInput").addEventListener("keydown",(event) => {
    if(event.key === "Enter"){
        let inp = document.getElementById("messageInput").value;
        let msgContainer = document.getElementById("messageContainer");
        let newDiv = document.createElement('div');
        newDiv.innerHTML = `<div class="flex justify-end">
          <div class="max-w-[80%] rounded-lg px-4 py-3 bg-[#444654] text-gray-100">
            <p class="text-sm">${inp}</p>
          </div>
        </div>`;
        msgContainer.appendChild(newDiv);
        inp = '';
    }
})
