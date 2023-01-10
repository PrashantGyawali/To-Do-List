var cooldown=0;
function task(content, deadline, priority,name) {
    this.name=name;
    this.content = content;
    this.deadline = deadline;
    this.priority = priority;
    this.completed= "not";
  }


let tasks=new Array();
if(JSON.parse(localStorage.getItem("tasks"))!=null)
{tasks=JSON.parse(localStorage.getItem("tasks"));};

createhtml(tasks);
setDefaultdate();



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

            let date=(t.slice(0,10)).concat(" ",t.slice(11,));
            let priority= document.getElementById("Priority").value;
            
            check_localStorage();

            let name=localStorage.name;

            const new_task= new task(text,date,priority,name);
            tasks.push(new_task);

            console.log(tasks);
            //Saving in local storage
            let x=JSON.stringify(tasks);
            localStorage.setItem("tasks",x);



            let y=document.createElement("div");
            y.innerHTML=`<div style="display: flex;">

            <button style="width: auto; color:rgba(0,0,0,0)" >hmm</button>
            <input type="text" style=" background-color: black; min-width:40%; overflow: scroll; color:white;" value="${new_task.content}" readonly class="${new_task.completed} id="${new_task.name}"> 
  
            <div style="width: fit-content;">
                <input type="button" readonly value="${new_task.deadline}" style="width:100%;" id="${new_task.name}_date">
                <input type="button" readonly value="${new_task.priority}" style="width:100%;" id="${new_task.name}_priority">
            </div>
  
            <div style="display:flex;  background-color: red;">
              <button id="${new_task.name}_edit" class="editBtn">Edit</button>
              <button id="${new_task.name}_delete" class="delBtn">Delete</button>
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
                  <div style="display: flex;">

                  <button style="width: auto; color:rgba(0,0,0,0)" >hmm</button>
                  <input type="text" style=" background-color: black; min-width:40%; overflow: scroll; color:white;" value="${task.content}" readonly class="${task.completed} id="${task.name}"> 
        
                  <div style="max-width:120px;">
                      <input type="button" readonly value="${task.deadline}" style="width:100%;" id="${task.name}_date">
                      <input type="button" readonly value="${task.priority}" style="width:100%;" id="${task.name}_priority">
                  </div>
        
                  <div style="display:flex;  background-color: red;">
                    <button id="${task.name}_edit" class="editBtn">Edit</button>
                    <button id="${task.name}_delete" class="delBtn">Delete</button>
                  </div>
                </div>`;
    document.getElementById("tasks").appendChild(y);

}
)}};
























//checks if date is valid i.e cannot create new task thats scheduled for yesterday
function Datecheck() { document.getElementById("datePickerId").removeAttribute("min");
    let x=new Date().toISOString();
    document.getElementById("datePickerId").setAttribute("min", x.slice(0,16));;
}





function check_localStorage()
{ if(localStorage.name)
  {
    localStorage.name = Number(localStorage.name) + 1;
  }
  else{
      localStorage.name=1;
  }
}



//Sets a default date as tomorrow
function setDefaultdate() { document.getElementById("datePickerId").removeAttribute("min");
    let tomorrow = (new Date(new Date().setDate(new Date().getDate() + 1))).toISOString();
    tomorrow=tomorrow.slice(0,16);
 
   // just giving default date as tomorrow- ignore this monstrocity
    let x=tomorrow.slice(0,11).concat( ((new Date()).toTimeString()).slice(0,5))
    document.getElementById("datePickerId").value=x;
    console.log(document.getElementById("datePickerId").value);
}