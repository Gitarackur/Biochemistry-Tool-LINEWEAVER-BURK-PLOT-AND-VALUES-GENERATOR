



//LOADER

window.onload= setTimeout(()=>{
    let loader= document.querySelector(".loader");  
    loader.className += " hidden";
}, 2000)



//INSTRUCTIONS
let instructionsBar= document.querySelector("#MainContainer .instructionsBar");
let instructions= document.querySelector("#MainContainer .instructions");


function INSTRUCT(){
    if(instructions.style.height=="100px"){
        instructions.style.height="0px";
    }else{
        instructions.style.height="100px";
    }
}

instructionsBar.addEventListener("click", INSTRUCT);


//CSS SELECTOR FOR SHOWING SLOPE IN UI
const viewSlope= document.querySelector(".showSlope");
viewSlope.style,display="none"



//GLOBAL DATAS
let StoreUIvelocityVal=[];
let StoreUIsubstrateVal=[];

let CalcVeloxxity=[];
let CalcSubxtrate=[];

let virtualVelocity;
let virtualsubstrate;


let graphData= [];


//THE FUNCTION BEARING THE VELOCITY AND SUBSTRATE PARAMETERS

 VelSub =()=>{

    
//THE CSS SELECTORS OF THE VELOCITY INPUT AND DISPLAY

    let velocityInput= document.querySelector(".inputVel");
    let MainVelDiv= document.querySelector(".mainVel");
    let REcV= document.querySelector(".REcV");

//THE CSS SELECTORS OF THE SUBSTRATE INPUT AND DISPLAY

    let substrateInput= document.querySelector(".inputSub");
    let MainSubDiv= document.querySelector(".mainSub");
    let REcS= document.querySelector(".REcS");

//THE CSS SELECTOR OF THE RESULT OF THE CALCULATIONS AND ITS DISPLAY

    let Result= document.querySelector("#result");
    Result.style.display="none";



//THE EVENT LISTENER THAT SOLVES ALL THE CALCULATIONS, DISPLAY THEM AND ALSO SHOW THE GRAPH OUTPUT OF THEM

    document.addEventListener("keypress", (event)=>{
        if(event.keyCode===13 || event.which===13){


            if(substrateInput.value==="" || velocityInput.value===""){
                alert("either one or two of the fields are empty..please insert a number(s) in the empty field(s)");
            }else if(substrateInput.value==="" && velocityInput.value==""){
                alert("the two fields are empty..please insert numbers in the two input fields");
            }else if(substrateInput.value===NaN  && velocityInput.value===NaN){
                alert("your input is not a number!");
            }else{

// DISPLAY THE DIV THAT WILL SHOW THE RESULT OF THE CALCULATIONS

                Result.style.display="flex";

// THIS IS THE VELOCITY CODE.. THE UI MIXED WITH THE FUNCTION CALL OF THE LOGIC CONTROLLER AND THE GRAPH

                let vel= document.createElement("div");
                let inputVelox= document.createTextNode(eval(velocityInput.value));
                vel.appendChild(inputVelox);
                MainVelDiv.appendChild(vel);

                StoreUIvelocityVal.push(parseFloat(eval(velocityInput.value)));
                velocityInput.value="";
                

                vel.style.padding="2%";


                LogicController().CalcVel();


                let ShowRecV = document.createElement("div");
                ShowRecV.style.padding="2%";
                let showV = document.createTextNode(virtualVelocity);
                ShowRecV.appendChild(showV);
                REcV.appendChild( ShowRecV);

                

// THIS IS THE SUBSTRATE CODE.. THE UI MIXED WITH THE FUNCTION CALL OF THE LOGIC CONTROLLER AND THE GRAPH


                let sub= document.createElement("div");
                let inputSubs= document.createTextNode(eval(substrateInput.value));
                sub.appendChild(inputSubs);
                MainSubDiv.appendChild(sub);

                StoreUIsubstrateVal.push(parseFloat(eval(substrateInput.value)));
                substrateInput.value="";

                sub.style.padding="2%";


                LogicController().CalcSub();


                let ShowRecS= document.createElement("div");
                ShowRecS.style.padding="2%";
                let showS= document.createTextNode(virtualsubstrate);
                ShowRecS.appendChild(showS);
                REcS.appendChild(ShowRecS);
                


                // OBTAINS THE DATA THAT WILL BE UTILIZED TO DRAWING THE GRAPH
                LogicController().graphData();

                //CALLS THE GRAPH OF THE RESULT
                ShowGraph();

                //CALCULATE THE SLOPE
                document.querySelector(".slopee").addEventListener("click", ()=>{
                    viewSlope.style.display="block";
                    viewSlope.style.padding="2%";
                    LogicController().slope();
                })
                
            }

        }
    })
}







//THE LOGIC CONTROLLER THAT PERFORMS THE LOGIC OF THE CALCULATIONS

let LogicController= ()=>{


    return{
        CalcVel:()=>{
           
                for(y in StoreUIvelocityVal){
                    CalcVeloxxity[y]= (1/(StoreUIvelocityVal[y]));
                    virtualVelocity= CalcVeloxxity[y];
                }
            },

        CalcSub:()=>{
            
            for(x in StoreUIsubstrateVal){
                CalcSubxtrate[x]= (1/(StoreUIsubstrateVal[x]));
                virtualsubstrate= CalcSubxtrate[x]
            }
        },

        graphData:()=>{
           
            let Guser={
                x: "",
                y: ""
            }
            
            for(i in CalcSubxtrate){
                Guser.x = CalcSubxtrate[i];
            }
        
        
            for(i in CalcVeloxxity){
                Guser.y= CalcVeloxxity[i];
                
            }

            graphData.push(Guser);
        
        },

        slope: ()=>{
        
            const maxV= Math.max(...CalcVeloxxity);
            const minV= Math.min(...CalcVeloxxity);
            
            const maxS= Math.max(...CalcSubxtrate);
            const minS= Math.min(...CalcSubxtrate);
        
            let slope= (maxV-minV)/(maxS-minS);
            
            console.log(slope)
        
            viewSlope.innerHTML= `the slope is ${RoundOff(slope, 3)}`;
        }
    }

}



// ROUNDOFF FUNCTION
    
function RoundOff(n, sig){
    var mult= Math.pow(10, sig-Math.floor(Math.log(n)/ Math.LN10) - 1);
    return Math.round(n * mult)/ mult;
}



// CALLING THE MAIN FUNCTION
VelSub();






// THE GRAPH CANVAS FIELD FOR THE LINEWEAVER-BURK EQUATION

var canvas = document.getElementById('graph');
canvas.width = window.innerWidth-10;
canvas.height = window.innerHeight/2;
var ctx= canvas.getContext('2d');

function ShowGraph(){
    canvas.style.display="block";
  
    
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'scatter',
    
        // The data for our dataset
        data: {

            datasets: [{
                
                data: graphData,

                label: 'Line Weaver-Burk Straight Line Graph',
                // backgroundColor: 'none',
                borderColor: 'black',
                showLine: true,
                lineTension: 0,
                labels: "SUBSTRATE CONCENTRATION",
                pointBackgroundColor: "#2f80ed",
                beginAtZero: true,
                lineAtValue: 20000   

            }]
        },
    
        // Configuration options go here
        options: {
            bezierCurve : false,
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
}


function UpdateChart(){
    Chart.data.datasets[0].data=[];
    chart.update();
}




