var cooldown=0;
function task(content, deadline, priority) {
    this.content = content;
    this.deadline = deadline;
    this.priority = priority;
    this.completed= undefined;
  }


let tasks=new Array();
if(JSON.parse(localStorage.getItem("tasks"))!=null)
{tasks=JSON.parse(localStorage.getItem("tasks"));};

createhtml(tasks);

//checks if date is valid i.e cannot create new task thats scheduled for yesterday
function Datecheck() { document.getElementById("datePickerId").removeAttribute("min");
    let x=new Date().toISOString();
    document.getElementById("datePickerId").setAttribute("min", x.slice(0,16));;
}

//Add submit event listener on form and prevent default action
form1=document.getElementById("write_form")
form1.addEventListener("submit", submitevent);

function submitevent(event)
{   //Prevents page from reloading when submit button clicked
    event.preventDefault();

 //Prevents multiple task from creating when clicking multiple times in short instance
  if(cooldown==0)
     {
            let text=document.getElementById("writeplace").value;
            document.getElementById("writeplace").value="";
            let t=document.getElementById("datePickerId").value;
            let date=(t.slice(0,10)).concat(" ",t.slice(11,))
            let priority= document.getElementById("Priority").value;
  
            const new_task= new task(text,date,priority);
            tasks.push(new_task);

            //Saving in local storage
            let x=JSON.stringify(tasks);
            localStorage.setItem("tasks",x);

console.log(x);

            let y=document.createElement("div");
            y.innerHTML=`
            <div style="background-color: rgb(17, 17, 17); color:aqua; height:50px; width:30%; display:flex; justify-content: space-between;">
                  <button style="width:15%; background-color:#2b2b2b; border: #242424 2px solid;"></button>
                    <input type="text" style=" background-color: black; width: 100%; color:white;" value="${new_task.content}}" readonly>
                    <div style=" display: flex; flex-direction: column; justify-content: space-between;">
                          <div>${new_task.deadline}</div>
                          <div>${new_task.priority}</div>
                    </div>
                    <div style="display:flex;">
                    <button >Edit</button>
                    <button>Delete</button>
                    </div>
                </div>`;
            document.getElementById("tasks").appendChild(y);
        }
            //this is the thing that cause cooldown
            cooldown=1;
            setTimeout(()=>{cooldown=0;},500)
     }

function createhtml(tasks){

    var child = document.getElementById("tasks").lastElementChild; 
    while (child) {
        document.getElementById("tasks").removeChild(child);
        child = document.getElementById("tasks").lastElementChild;  }

      if(tasks!=null){
          tasks.forEach((task)=>{ 
                 let y=document.createElement("div");
                  y.innerHTML=`
             <div style="background-color: rgb(17, 17, 17); color:aqua; height:50px; width:30%; display:flex; justify-content: space-between;">
          <button style="width:15%; background-color:#2b2b2b; border: #242424 2px solid;"></button>
            <input type="text" style=" background-color: black; width: 100%; color:white;" value="${task['content']}}" readonly>
            <div style=" display: flex; flex-direction: column; justify-content: space-between;">
                  <div>${task['deadline']}</div>
                  <div>${task['priority']}</div>
            </div>
            <div style="display:flex;">
            <button >Edit</button>
            <button>Delete</button>
            </div>
        </div>`;
    document.getElementById("tasks").appendChild(y);

}
)}};



