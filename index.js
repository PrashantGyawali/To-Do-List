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
setDefaultdate('datePickerId');



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
                y.innerHTML=`<div style="display: flex; height:42px; width:85vw; max-width:900px; justify-content:center;" id="${task.name}_maindiv">

                <div style="min-width:0%;"><button style=" font-size:1.5em; height:42px;"  class="crossBtn ${task.completed}" id="${task.name}_cross" onclick="crossfn(${task.name})">&#10004;</button></div>
                 <div class="tasktxtdiv"><input type="text" style=" margin-top:3px;border-radius:5px;height:35px; background-color: black; width:98%; overflow: scroll; color:white; font-size:1em" value="${task.content}" readonly class="${task.completed}" id="${task.name}" spellcheck="false"> </div> 
              
                  <div style="min-width:min(19%,21vw)">
                  <span title="Priority"><div  id="${task.name}_priorityDiv" style="width:100%; padding:0px;"> <input type="button" readonly value="${task.priority}" style="width:100%; height:50%; padding-left:0px; padding-right:0px;" id="${task.name}_priority"></div></span>
                 <span title="Deadline"><div  id="${task.name}_dateDiv" style="width:100%; padding:0px;"><input type="button" readonly value="${task.deadline}" style="font-size:0.75em;width:100%; height:50%; " id="${task.name}_date"  > </div></span>
                  </div>
              
                  <div style="display:flex;max-width:15vw;min-width:15%">
                    <input type="button" id="${task.name}_edit" class="editBtn" onclick="editfn(${task.name})" readonly>
                    <button id="${task.name}_delete" class="delBtn"></button>
                  </div>
                </div>`

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
            fadeDiv.style.transition = 'opacity 0.7s';
            fadeDiv.style.opacity = 0;
        }
        setTimeout(
            function(){
            tasks=tasks.filter((m)=>{return m.name!=btnid});
            if(filteredtasks!=tasks)
            {filteredtasks=filteredtasks.filter((m)=>{return m.name!=btnid});}
            createhtml(tasks);
           createhtml(filteredtasks);},700);
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
if(filteredtasks.length>0)
{createhtml(filteredtasks);}
}



  function editfn(btn)
  {
    let textPlace=document.getElementById(btn);
    let button=document.getElementById(btn+"_edit");

    if(textPlace.hasAttribute('readonly'))
    {
      textPlace.removeAttribute('readonly');
      textPlace.focus();
      button.style.backgroundImage='url("./icons/savebtn.png")';
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
  if(filteredtasks.length>0||filteredtasks==tasks)
  {createhtml(filteredtasks);} }

  }


  function allowdropdown(btn){
    let button=document.getElementById(btn+"_priority");
    button.remove();
    let priorityDiv=document.getElementById(btn+"_priorityDiv");
    priorityDiv.innerHTML=
                      `
                      <select name="Priority" id="${btn}_priorityList" style="width:100%; height:21px;" class="dropdown">
                         <option value="Highest">Highest Priority</option>
                         <option value="High">High Priority</option>
                         <option value="Medium">Medium Priority</option>
                         <option value="Low">Low Priority</option>
                      </select>`;  
for (x of tasks) {
    if (x.name == btn) {
        document.getElementById(btn + '_priorityList').value = x.priority;
    }
}
         
}



function datemodify(btn){
  let button=document.getElementById(btn+"_date");
  button.style.maxWidth='max(7vw,75%)';
  button.classList.add('datebtn2');
  let dateDiv=document.getElementById(btn+"_dateDiv");
  dateDiv.style.backgroundColor='#f0f0f0';
  dateDiv.innerHTML+=
                      `
                      <input type="datetime-local" name="datePickerId"  id="${btn}_datePickerId" style="max-width:min(18px,1.3vw);min-width:13px; padding:0px; margin:0px;"  >
                      `;

    let calendar= document.getElementById(btn + '_datePickerId');
    calendar.style.backgroundColor='#f0f0f0';
     function fn()
    {   console.log('hello');
    let calendar= document.getElementById(btn + '_datePickerId');
        calendar.focus();
    }

    let datetxt=document.getElementById(btn+"_date");
    let temp1=datetxt.value.slice(2,4);
    let temp2=datetxt.value.slice(5,7);
    let temp3=datetxt.value.slice(8,10);
    let temp4=datetxt.value.slice(11,13);
    let temp5=datetxt.value.slice(14,16);
    datetxt.value=temp1+"|"+temp2+"|"+temp3+"|"+temp4+":"+temp5;
    button.style.fontStretch='50%';
    datetxt.style.fontSize="11px";


dateDiv.addEventListener('click',fn);
  for (x of tasks) {
  if (x.name == btn) {
     calendar.value =x.deadline;
}
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
function setDefaultdate(y) { 
document.getElementById(y).removeAttribute("min");

// just giving default date as tomorrow-
const msSinceEpoch = (new Date()).getTime();
let tomorrow = (new Date(msSinceEpoch + 24 * 60 * 60 * 1000)).toLocaleString("sv-SE");
let now=(new Date()).toLocaleString("sv-SE");

document.getElementById(y).value=tomorrow;
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
                      <span title="Select on what basis you want to sort your to-do-list"> <select name="sortfocus" id="sortfocus" style="font-size:17px; height:29px" onclick='getvalue()'>
                         <option value="none" selected disabled hidden>Sorting Focus</option> 
                         <option value="priorityfocus">Priority Focused</option>
                         <option value="datefocus">Date Focused</option>
                         <option value="nope">None</option>
                      </select>
                      </span>
                      `;
                      let filterdiv=document.getElementById("filterdiv");
                      filterdiv.innerHTML=`<button style="height: fit-content; font-size: 20px;" id="filterbtn" onclick="filterstart()">Filter</button>`;
}



function getvalue(){
    if(document.getElementById('sortfocus').value!='none')
    {
        let x=document.getElementById('sortfocus').value;
        let priorityDiv=document.getElementById('sortplace');
        if(x=='priorityfocus')
         {priorityDiv.innerHTML= `
         <span title="First Sorted on basis of Priority">
         <div id="sortdivs" style="display: flex; flex-direction: column; width: 100%; max-width:166px"></span>
        <select name="sortPriority" id="sortPriority" style="text-align:center;" >
          <option value="d" selected>Priority: High to Low</option>
          <option value="a">Priority: Low to High</option>
       </select>
       
       <div id="datesortdiv" style="display: flex; width: 100%; justify-content:space-between">
       <span title="If Priority same then sorted according to date"><select name="sortdate" id="sortdate" style="text-align:center;">
         <option value="dateAdded" selected >Date added</option>
         <option value="deadline">Deadline</option>
      </select></span>
      <span title="For same priority Date is arranged in ascending or descending?"><button id="sortorder" style=" font-size:12px; padding:0px;" value="d" onclick="arrowdir()">Decreasing</button></div></span>
     <span title="Finally sort"> <button onclick="sortlist('priorityfocus')" style=" width: 100%;">Sort</button> </span>`;
    }

    if(x=='datefocus')
    {priorityDiv.innerHTML= `
    
    <div id="sortdivs" style="display: flex; flex-direction: column; min-width: 180px; justify-content:center;">
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
if(document.getElementById('sortfocus').value=='nope'){
    let sortdiv=document.getElementById("sortplace");
    sortdiv.innerHTML=`<span title="Sort your To-do-list"><button id="Sortbtn" style="font-size: 20px;" onclick="sortbtn()">Sort</button> </span></a>`; 
}
}


function filterstart()
{
    let div=document.getElementById('filterdiv');
    div.innerHTML=` <span title="Filter By"> <select name="filtermethod" id="filtermethod" style="text-align:center; justify-self:left; font-size:19px; height:29px" onclick="filterstep2()">
    <option value=" " disabled hidden selected>Filter method</option>
    <option value="priority" >Priority</option>
    <option value="deadline" >Deadline</option>
    <option value="none" >None</option>
 </select></span>`

 let sortdiv=document.getElementById("sortplace");
 sortdiv.innerHTML=`<span title="Sort your To-do-list"><button id="Sortbtn" style="font-size: 20px;" onclick="sortbtn()">Sort</button> </span></a>`
}

function filterstep2()
{

    let filterstyle=document.getElementById('filtermethod').value;
    if(filterstyle=='priority')
    {
        filterByPriority();
    }
    if(filterstyle=='none')
    {
        filteredtasks=[...tasks];
        createhtml(tasks);
        filterend();
    }
    if(filterstyle=='deadline')
    {
        filterByDate();
    }
}

function filterByPriority()
{    let div=document.getElementById('filterdiv');
   div.innerHTML=`    <select name="priorityfilter" id="priorityfilter" onclick="filterByPriorityStep2()"  style="justify-self:left;height: fit-content; font-size: 20px;">
    <option value="none" selected disabled hidden>Set Priority</option>
     <option value="Highest">Highest Priority</option>
     <option value="High">High Priority</option>
     <option value="Medium">Medium Priority</option>
     <option value="Low">Low Priority</option>
     <option value="All">All</option>
  </select>`  
}
function filterByPriorityStep2()
{   let prioritymthd=document.getElementById('priorityfilter').value;
    let date;
    if(prioritymthd!='none'&&prioritymthd!='All')
    {
      filteredtasks=tasks.filter((x)=>{return x.priority==`${prioritymthd}`});
      createhtml(filteredtasks);
      filterend();
    }
    if(prioritymthd=='All')
    {
        createhtml(tasks);
        searchclick();
    }
}

function filterByDate()
{
    let div=document.getElementById('filterdiv');
    div.innerHTML=
    `<div>
    <div><button style="height:29px; float:left;width:50%">Start</button><button style="height:29px; float:right; width:50%" onclick="searchclick()">Cancel</button><br><input type="datetime-local" name="startdate"  id="startdate" class="datef" ></div>
    <div><button style="height:29px; float:left; width:50%">End</button><button style="height:29px;float:right; width:50%">Filter</button><br><input type="datetime-local" name="enddate"  id="enddate" class="datef" ></div> 
    </div>
    `  ;
    document.getElementById('startdate').value=(new Date).toLocaleString("sv-SE")
    setDefaultdate('enddate');
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


function search(){
    let x=document.getElementById('searchtxt').value;
    document.getElementById('searchtxt').value="";
    if(x&&x!=''&&x!=" ")
    {
        let searches=x.split(' ');
        let testdata=[...tasks];

        filteredtasks=[];
        console.log("huhu");
        testdata.forEach((x)=>{searching(x)});

        function searching(x)
        {
            searches.forEach(
            (y)=>{let re = new RegExp(y, 'i');
            let i=(x.content).match(re);
            console.log(i);
            if(i)
            {   filteredtasks.push(x)}
            });
        }
        createhtml(filteredtasks);
    }
}

function searchclick(){
let filterdiv=document.getElementById("filterdiv");
filterdiv.innerHTML=`<button style="height: fit-content; font-size: 20px;" id="filterbtn" onclick="filterstart()">Filter</button>`;
let sortdiv=document.getElementById("sortplace");
 sortdiv.innerHTML=`<span title="Sort your To-do-list"><button id="Sortbtn" style="font-size: 20px;" onclick="sortbtn()">Sort</button> </span></a>`;
 createhtml(tasks);
}







