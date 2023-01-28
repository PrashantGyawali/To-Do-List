var cooldown=0;
function task(content, deadline, priority, name) {
    this.name = name;
    this.content = content;
    this.deadline = deadline;
    this.priority = priority;
    this.completed = "not";
    this.dateAdded= (new Date()).toISOString();
}


let tasks = new Array();
if (JSON.parse(localStorage.getItem("tasks")) != null) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
};

let filteredtasks=[...tasks];
createhtml(tasks);
setDefaultdate();



//Add submit event listener on form and prevent default action
let form1=document.getElementById("write_form")
form1.addEventListener("submit", submitevent);

function submitevent(event)
{   //Prevents page from reloading when submit button clicked
    event.preventDefault();

 //Prevents multiple task from creating when clicking multiple times in short instance
 document.getElementById('sortplace').innerHTML=`<span title="Sort your To-do-list"><button id="Sortbtn" style="font-size: 20px;" onclick="sortbtn()">Sort</button> </span>`;
  if(cooldown==0)
     {
            let text=document.getElementById("writeplace").value;
            document.getElementById("writeplace").value="";
            let t=document.getElementById("datePickerId").value;

            let date=(t.slice(0,10)).concat(" ",t.slice(11,));
            let priority= document.getElementById("Priority").value=='none'?'Medium':document.getElementById("Priority").value;
            
            check_localStorage();

            let name=localStorage.name;

            const new_task= new task(text,date,priority,name);
            tasks.push(new_task);


            //Saving in local storage
            let x=JSON.stringify(tasks);
            localStorage.setItem("tasks",x);
           createhtml(tasks);
            //this is the thing that cause cooldown
            cooldown=1;
            setTimeout(()=>{cooldown=0;},500)

     }
     }

function createhtml(suppliedtasks) {
  //removes already existing child nodes to update 

  let x = JSON.stringify(tasks);
    localStorage.setItem("tasks", x);

    document.getElementById("tasks").innerHTML=''
    if(document.getElementById('Sortbtn'))
    {document.getElementById('Sortbtn').style.visibility= 'hidden';}

    if (suppliedtasks != null) {
        suppliedtasks.forEach((task) => {
  
            let y = document.createElement("div");
            y.innerHTML = `
                  <div style="display: flex; margin:3px; height:42px; width:100vw; justify-content:center;" id="${task.name}_maindiv">

                <button style="width: auto; font-size:150%; padding:0px;"  class="crossBtn ${task.completed}" id="${task.name}_cross" onclick="crossfn(${task.name})"><span style="color:rgba(0,0,0,0)">.</span>&#10004;<span style="color:rgba(0,0,0,0)">.</span></button>
                  <input type="text" style=" background-color: black; min-width:40%; overflow: scroll; color:white; font-size:15px" value="${task.content}" readonly class="${task.completed}" id="${task.name}" spellcheck="false"> 
        
                  <div style="max-width:120px;">
                  <span title="Priority"><div  id="${task.name}_priorityDiv" style="width:100%; "> <input type="button" readonly value="${task.priority}" style="width:100%; height:50%" id="${task.name}_priority"></div></span>
                 <span title="Deadline"><div  id="${task.name}_dateDiv" style="width:100%;"><input type="button" readonly value="${task.deadline}" style="width:100%; height:50%;" id="${task.name}_date"  > </div></span>
                  </div>
        
                  <div style="display:flex;width:92px;">
                    <button id="${task.name}_edit" style=""class="editBtn" onclick="editfn(${task.name})"></button>
                    <button id="${task.name}_delete"class="delBtn"><span style="opacity:0">Delete</span></button>
                  </div>
                </div>`;

            document.getElementById("tasks").appendChild(y);
            delBtnSetUp();


            if(document.getElementById('Sortbtn'))
            {document.getElementById('Sortbtn').style.visibility= 'visible';}
            }
        )}
    };














function delBtnSetUp() {
    let delBtns = document.getElementsByClassName("delBtn");

    Array.from(delBtns).forEach((delBtn) => {
            delBtn.addEventListener("click", delfn);
        });

    function delfn(event) {
        let btnid = event.target.id;

        btnid = btnid.slice(0, -7);
  
        let fadeDiv = document.getElementById(btnid+"_maindiv");

        if (fadeDiv) {
            fadeDiv.style.transition = 'opacity 0.5s';
            fadeDiv.style.opacity = 0;
        }
        setTimeout(
            function(){
            tasks=tasks.filter((m)=>{return m.name!=btnid});
            filteredtasks=filteredtasks.filter((m)=>{return m.name!=btnid});
            
           createhtml(filteredtasks);},500);
    }
}

function crossfn(btn) {
    for (x of tasks) {
        if (x.name == btn) {
            if (x.completed == 'completed') {
                {
                    x.completed = 'not';
                }
            } else {
                x.completed = 'completed';
            }
        };

        let textPlace = document.getElementById(btn);

        for (x of tasks) {
            if (x.name == btn) {
                x.content = textPlace.value;
                if (document.getElementById(btn + '_priorityList') != null) {
                    let importance = document.getElementById(btn + '_priorityList');
                    x.priority = importance.value;
                }
            };
        }
    }
  createhtml(tasks);
createhtml(filteredtasks);
}



  function editfn(btn)
  {
    let textPlace=document.getElementById(btn);
    let button=document.getElementById(btn+"_edit");

    if(textPlace.hasAttribute('readonly'))
    {
      textPlace.removeAttribute('readonly');
      textPlace.focus();
      button.style.backgroundImage='url("savebtn.png")';
      allowdropdown(btn);
      datemodify(btn);
    }
    else{
      textPlace.setAttribute('readonly','readonly');

      for(x of tasks)
    { if(x.name==btn)
         {
          x.content=textPlace.value;
          x.priority=document.getElementById(btn+'_priorityList').value ;
          
          let temp=document.getElementById(btn+'_datePickerId').value ;
          x.deadline=temp.slice(0,10).concat(" ",temp.slice(11,));
        };
        
  }
  createhtml(tasks);
  filteredtasks=[...tasks];
  createhtml(filteredtasks);
    }

  }


  function allowdropdown(btn){
    let button=document.getElementById(btn+"_priority");
    button.remove();
    let priorityDiv=document.getElementById(btn+"_priorityDiv");
    priorityDiv.innerHTML=
                      `
                      <select name="Priority" id="${btn}_priorityList" style="width:100%; height:21px">
                         <option value="Highest">Highest Priority</option>
                         <option value="High">High Priority</option>
                         <option value="Medium">Medium Priority</option>
                         <option value="Low">Low Priority</option>
                      </select>`;
//   let options=Array.from(document.getElementById(btn+'_priorityList').options);
  
for (x of tasks) {
    if (x.name == btn) {
        document
            .getElementById(btn + '_priorityList')
            .value = x.priority;
    }
}
         
}



function datemodify(btn){
  let button=document.getElementById(btn+"_date");
  button.style.width='94px';
  button.style.height='21px';
  button.style.fontSize='10px';
  let dateDiv=document.getElementById(btn+"_dateDiv");
    dateDiv.innerHTML+=
                      `
                      <input type="datetime-local" name="datePickerId"  id="${btn}_datePickerId" style="width:18px; padding:0px; margin:0px;"  >
                      `;
                    
  for (x of tasks) {
  if (x.name == btn) {
  document.getElementById(btn + '_datePickerId').value = x.deadline;}

  }
}
 








//checks if date is valid i.e cannot create new task thats scheduled for yesterday
function Datecheck(datePickerId) { document.getElementById(datePickerId).removeAttribute("min");
    let x=new Date().toISOString();
    document.getElementById(datePickerId).setAttribute("min", x.slice(0,16));;
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
}




function sortDate_Priority(orderedTasks,datecondn,x,priorityorder)
{   
    for(let i=0;i<orderedTasks.length-1; i++)
    {
       
       for(let j=i+1;j<orderedTasks.length; j++) 
       {
        if(x=='d')
        {
        if(orderedTasks[i][`${datecondn}`]<orderedTasks[j][`${datecondn}`])
        {
            t=orderedTasks[i];
            orderedTasks[i]=orderedTasks[j];
            orderedTasks[j]=t;
        }
        if(orderedTasks[i][`${datecondn}`]==orderedTasks[j][`${datecondn}`])
        {
            if(priorityorder=='d')
            {
                let priority1=orderedTasks[i].priority;
                let priority2=orderedTasks[j].priority;
                priority1 = priority1 == 'Highest'? 4: priority1 == 'High'? 3: priority1 == 'Medium'? 2: 1;
                priority2 = priority2 == 'Highest'? 4: priority2 == 'High'? 3: priority2 == 'Medium'? 2: 1;
                if(priority1<priority2)
                {
                    t=orderedTasks[i];
                    orderedTasks[i]=orderedTasks[j];
                    orderedTasks[j]=t;
                }
               }

               if(priorityorder=='a')
            {
                let priority1=orderedTasks[i].priority;
                let priority2=orderedTasks[j].priority;
                priority1 = priority1 == 'Highest'? 4: priority1 == 'High'? 3: priority1 == 'Medium'? 2: 1;
                priority2 = priority2 == 'Highest'? 4: priority2 == 'High'? 3: priority2 == 'Medium'? 2: 1;
                if(priority1>priority2)
                {
                    t=orderedTasks[i];
                    orderedTasks[i]=orderedTasks[j];
                    orderedTasks[j]=t;
                }
               }
            }
        }
       
    
       if(x=='a')
      { if(orderedTasks[i][`${datecondn}`]>orderedTasks[j][`${datecondn}`])
        {
            t=orderedTasks[i];
            orderedTasks[i]=orderedTasks[j];
            orderedTasks[j]=t;
        }
        if(orderedTasks[i][`${datecondn}`]==orderedTasks[j][`${datecondn}`])
        {
            let priority1=orderedTasks[i].priority;
                let priority2=orderedTasks[j].priority;
                priority1 = priority1 == 'Highest'? 4: priority1 == 'High'? 3: priority1 == 'Medium'? 2: 1;
                priority2 = priority2 == 'Highest'? 4: priority2 == 'High'? 3: priority2 == 'Medium'? 2: 1;
            if(priorityorder=='a')
            {  
                if(priority1>priority2)
                {
                    t=orderedTasks[i];
                    orderedTasks[i]=orderedTasks[j];
                    orderedTasks[j]=t;
                }
               }

               if(priorityorder=='d')
            {
                if(priority1<priority2)
                {
                    t=orderedTasks[i];
                    orderedTasks[i]=orderedTasks[j];
                    orderedTasks[j]=t;
                }
               }
            }
        }
       }
    }
    };



function sortPriority_Date(orderedTasks,datecondn,x,priorityorder)
    { 

        for(let i=0;i<orderedTasks.length-1; i++)
    {
       
       for(let j=i+1;j<orderedTasks.length; j++) 
       {
            if(priorityorder=='a')
            {
                let priority1=orderedTasks[i].priority;
                let priority2=orderedTasks[j].priority;
                priority1 = priority1 == 'Highest'? 4: priority1 == 'High'? 3: priority1 == 'Medium'? 2: 1;
                priority2 = priority2 == 'Highest'? 4: priority1 == 'High'? 3: priority1 == 'Medium'? 2: 1;
                if(priority1>priority2)
                {
                    t=orderedTasks[i];
                    orderedTasks[i]=orderedTasks[j];
                    orderedTasks[j]=t;
                }
                if(orderedTasks[i].priority==orderedTasks[j].priority)
                {
                    if(x=='d')
                         {
                             if(orderedTasks[i][`${datecondn}`]<orderedTasks[j][`${datecondn}`])
                                 {
                                     t=orderedTasks[i];
                                    orderedTasks[i]=orderedTasks[j];
                                     orderedTasks[j]=t;
                                 }
                         }
                         if(x=='a')
                         {
                             if(orderedTasks[i][`${datecondn}`]>orderedTasks[j][`${datecondn}`])
                                 {
                                     t=orderedTasks[i];
                                    orderedTasks[i]=orderedTasks[j];
                                     orderedTasks[j]=t;
                                 }
                         }
               }
            }

               if(priorityorder=='d')
            {
                let priority1=orderedTasks[i].priority;
                let priority2=orderedTasks[j].priority;
                priority1 = priority1 == 'Highest'? 4: priority1 == 'High'? 3: priority1 == 'Medium'? 2: 1;
                priority2 = priority2 == 'Highest'? 4: priority2 == 'High'? 3: priority2 == 'Medium'? 2: 1;
                if(priority1<priority2)
                {
                    t=orderedTasks[i];
                    orderedTasks[i]=orderedTasks[j];
                    orderedTasks[j]=t;
                }
                if(orderedTasks[i].priority==orderedTasks[j].priority)
                {
                    if(x=='d')
                         {
                             if(orderedTasks[i][`${datecondn}`]<orderedTasks[j][`${datecondn}`])
                                 {
                                     t=orderedTasks[i];
                                    orderedTasks[i]=orderedTasks[j];
                                     orderedTasks[j]=t;
                                 }
                         }
                    if(x=='a')
                         {
                             if(orderedTasks[i][`${datecondn}`]>orderedTasks[j][`${datecondn}`])
                                 {
                                     t=orderedTasks[i];
                                    orderedTasks[i]=orderedTasks[j];
                                     orderedTasks[j]=t;
                                 }
                         }
               }
            }    
    }            
    }
    };



function arrowdir()
    { let btn=document.getElementById('sortorder');
        if(btn.value=='a')
        {
            btn.value='d';
            btn.innerText= 'Decreasing';
        }
        else{btn.value='a';
        btn.innerText= 'Increasing';}
    }

function sortlist(x)
{
    if(filteredtasks==tasks)
    {var orderedTasks=[...tasks];}
    else{
        var orderedTasks=[...filteredtasks];
    }
    let datecondn=document.getElementById('sortdate').value;
    let sortorder=document.getElementById('sortorder').value;
    let priorityorder=document.getElementById('sortPriority').value;



    if(x=='datefocus')
    {sortDate_Priority(orderedTasks,datecondn,sortorder,priorityorder);}
    
    if(x=='priorityfocus')
    {sortPriority_Date(orderedTasks,datecondn,sortorder,priorityorder);}
    document.getElementById('sortplace').innerHTML=`<span title="Sort your To-do-list"><button id="Sortbtn" style="font-size: 20px;" onclick="sortbtn()">Sort</button> </span>`;
    createhtml(orderedTasks);
}

function sortbtn()
{
    let button=document.getElementById('Sortbtn');
    button.remove();
    let priorityDiv=document.getElementById('sortplace');
    priorityDiv.innerHTML=
                      `
                      <span title="Select on what basis you want to sort your to-do-list"> <select name="sortfocus" id="sortfocus" style="height:21px" onclick='getvalue()'>
                         <option value="none" selected disabled hidden>Select Sorting Focus</option> 
                         <option value="priorityfocus">Priority Focused</option>
                         <option value="datefocus">Date Focused</option>
                      </select>
                      </span>
                      `;
    
}



function getvalue(){
    if(document.getElementById('sortfocus').value!='none')
    {
        let x=document.getElementById('sortfocus').value;
        let priorityDiv=document.getElementById('sortplace');
        if(x=='priorityfocus')
         {priorityDiv.innerHTML= `
         <span title="First Sorted on basis of Priority">
         <div id="sortdivs" style="display: flex; flex-direction: column; width: 180px;"></span>
        <select name="sortPriority" id="sortPriority" style="text-align:center;" >
          <option value="d" selected>Priority: High to Low</option>
          <option value="a">Priority: Low to High</option>
       </select>
       
       <div id="datesortdiv" style="display: flex; width: 180px;">
       <span title="If Priority same then sorted according to date"><select name="sortdate" id="sortdate" style="text-align:center;">
         <option value="dateAdded" selected >Date added</option>
         <option value="deadline">Deadline</option>
      </select></span>
      <span title="For same priority Date is arranged in ascending or descending?"><button id="sortorder" style=" font-size:14px; padding:0px 5px 0px 5px; width: 87px;" value="d" onclick="arrowdir()">Decreasing</button></div></span>
     <span title="Finally sort"> <button onclick="sortlist('priorityfocus')" style=" width: 180px;">Sort</button> </span>`;
    }

    if(x=='datefocus')
    {priorityDiv.innerHTML= `
    
    <div id="sortdivs" style="display: flex; flex-direction: column; width: 180px;">
    <div id="datesortdiv" style="display: flex; width: 180px;">
   <span title="What date you want to sort according to?"> <select name="sortdate" id="sortdate" style="text-align:center;">
      <option value="dateAdded"  >Date added</option>
      <option value="deadline" selected>Deadline</option>
   </select></span>
   <button id="sortorder" style=" font-size:14px; padding:0px 5px 0px 5px; width: 87px;" value="d" onclick="arrowdir()">Decreasing</button></div>
   <span title="If date same then sorted according to priority"> <select name="sortPriority" id="sortPriority" style="text-align:center; width:180px; " >
     <option value="d" selected>Priority: High to Low</option>
     <option value="a">Priority: Low to High</option>
  </select></span>
 <button onclick="sortlist('datefocus')" style=" width: 180px;">Sort</button>`;
}
}
}


function filterstart()
{
    let div=document.getElementById('filterdiv');
    div.innerHTML=` <span title="Filter By"> <select name="filtermethod" id="filtermethod" style="text-align:center;" onclick="filterstep2()">
    <option value=" " disabled hidden selected>Select filter method</option>
    <option value="priority" >Priority</option>
    <option value="deadline" >Deadline</option>
    <option value="none" >None</option>

 </select></span>`
}

function filterstep2()
{

    let filterstyle=document.getElementById('filtermethod').value;
    if(filterstyle=='priority')
    {
        filterByPriority();
    }
}

function filterByPriority()
{    let div=document.getElementById('filterdiv');
   div.innerHTML=`    <select name="priorityfilter" id="priorityfilter" onclick="filterByPriorityStep2()">
    <option value="none" selected disabled hidden>Set Priority</option>
     <option value="Highest">Highest Priority</option>
     <option value="High">High Priority</option>
     <option value="Medium">Medium Priority</option>
     <option value="Low">Low Priority</option>
  </select>`

  
}
function filterByPriorityStep2()
{   let prioritymthd=document.getElementById('priorityfilter').value;
    if(prioritymthd!='none')
    {
      filteredtasks=tasks.filter((x)=>{return x.priority==`${prioritymthd}`});
      createhtml(filteredtasks);
      filterend();
    }
}
function filterend()
{
    let div=document.getElementById('filterdiv');
    div.innerHTML=`<button style="height: fit-content; font-size: 20px;" id="filterbtn" onclick="filterstart()">Filter</button>`
}

 function deleteAll()
{ 
    let x=Array.from(document.getElementsByClassName('delBtn'));
    let r=confirm("Are you sure?");
    if (r==true)
      {
        x.forEach((y)=>{y.click();});
      }
}










