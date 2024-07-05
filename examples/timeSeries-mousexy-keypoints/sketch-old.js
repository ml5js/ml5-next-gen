let sequence = [];
let datasets = [];

let pressedOnce = true;

let boxes =

[[{"name":"box","mouse":[81,102]},{"name":"box","mouse":[85,101]},{"name":"box","mouse":[134,105]},{"name":"box","mouse":[182,106]},{"name":"box","mouse":[219,108]},{"name":"box","mouse":[244,108]},{"name":"box","mouse":[258,108]},{"name":"box","mouse":[258,108]},{"name":"box","mouse":[263,154]},{"name":"box","mouse":[267,215]},{"name":"box","mouse":[269,235]},{"name":"box","mouse":[269,239]},{"name":"box","mouse":[265,239]},{"name":"box","mouse":[195,236]},{"name":"box","mouse":[147,243]},{"name":"box","mouse":[113,243]},{"name":"box","mouse":[111,242]},{"name":"box","mouse":[106,236]},{"name":"box","mouse":[101,191]},{"name":"box","mouse":[95,162]}],

[{"name":"box","mouse":[105,97]},{"name":"box","mouse":[149,99]},{"name":"box","mouse":[191,99]},{"name":"box","mouse":[245,99]},{"name":"box","mouse":[257,99]},{"name":"box","mouse":[260,100]},{"name":"box","mouse":[255,144]},{"name":"box","mouse":[249,215]},{"name":"box","mouse":[249,239]},{"name":"box","mouse":[248,240]},{"name":"box","mouse":[200,234]},{"name":"box","mouse":[134,232]},{"name":"box","mouse":[105,232]},{"name":"box","mouse":[105,229]},{"name":"box","mouse":[96,179]},{"name":"box","mouse":[96,121]},{"name":"box","mouse":[97,97]},{"name":"box","mouse":[97,96]},{"name":"box","mouse":[97,96]},{"name":"box","mouse":[97,96]}],

[{"name":"box","mouse":[94,94]},{"name":"box","mouse":[133,95]},{"name":"box","mouse":[194,100]},{"name":"box","mouse":[245,100]},{"name":"box","mouse":[261,102]},{"name":"box","mouse":[261,102]},{"name":"box","mouse":[257,132]},{"name":"box","mouse":[253,196]},{"name":"box","mouse":[253,227]},{"name":"box","mouse":[253,228]},{"name":"box","mouse":[241,227]},{"name":"box","mouse":[183,221]},{"name":"box","mouse":[137,219]},{"name":"box","mouse":[105,219]},{"name":"box","mouse":[104,219]},{"name":"box","mouse":[98,188]},{"name":"box","mouse":[97,157]},{"name":"box","mouse":[97,132]},{"name":"box","mouse":[97,112]},{"name":"box","mouse":[98,101]}],

[{"name":"box","mouse":[88,92]},{"name":"box","mouse":[94,91]},{"name":"box","mouse":[158,94]},{"name":"box","mouse":[209,96]},{"name":"box","mouse":[244,96]},{"name":"box","mouse":[245,96]},{"name":"box","mouse":[245,96]},{"name":"box","mouse":[244,140]},{"name":"box","mouse":[238,203]},{"name":"box","mouse":[238,226]},{"name":"box","mouse":[238,226]},{"name":"box","mouse":[202,222]},{"name":"box","mouse":[154,220]},{"name":"box","mouse":[96,220]},{"name":"box","mouse":[92,220]},{"name":"box","mouse":[90,217]},{"name":"box","mouse":[89,183]},{"name":"box","mouse":[89,149]},{"name":"box","mouse":[89,124]},{"name":"box","mouse":[89,98]}],

[{"name":"box","mouse":[98,100]},{"name":"box","mouse":[169,101]},{"name":"box","mouse":[278,104]},{"name":"box","mouse":[310,104]},{"name":"box","mouse":[312,104]},{"name":"box","mouse":[312,148]},{"name":"box","mouse":[313,244]},{"name":"box","mouse":[314,248]},{"name":"box","mouse":[313,250]},{"name":"box","mouse":[222,235]},{"name":"box","mouse":[151,237]},{"name":"box","mouse":[85,239]},{"name":"box","mouse":[82,231]},{"name":"box","mouse":[79,185]},{"name":"box","mouse":[84,140]},{"name":"box","mouse":[93,113]},{"name":"box","mouse":[97,104]},{"name":"box","mouse":[97,100]},{"name":"box","mouse":[97,100]},{"name":"box","mouse":[97,100]}],

[{"name":"box","mouse":[69,98]},{"name":"box","mouse":[149,97]},{"name":"box","mouse":[263,97]},{"name":"box","mouse":[303,98]},{"name":"box","mouse":[303,100]},{"name":"box","mouse":[300,201]},{"name":"box","mouse":[306,296]},{"name":"box","mouse":[307,300]},{"name":"box","mouse":[293,296]},{"name":"box","mouse":[199,275]},{"name":"box","mouse":[145,272]},{"name":"box","mouse":[109,272]},{"name":"box","mouse":[99,269]},{"name":"box","mouse":[95,266]},{"name":"box","mouse":[87,206]},{"name":"box","mouse":[82,140]},{"name":"box","mouse":[82,116]},{"name":"box","mouse":[82,102]},{"name":"box","mouse":[82,100]},{"name":"box","mouse":[82,100]}],

[{"name":"box","mouse":[61,103]},{"name":"box","mouse":[68,100]},{"name":"box","mouse":[145,101]},{"name":"box","mouse":[221,104]},{"name":"box","mouse":[264,104]},{"name":"box","mouse":[291,107]},{"name":"box","mouse":[291,109]},{"name":"box","mouse":[289,177]},{"name":"box","mouse":[281,248]},{"name":"box","mouse":[281,271]},{"name":"box","mouse":[278,272]},{"name":"box","mouse":[230,270]},{"name":"box","mouse":[179,268]},{"name":"box","mouse":[112,268]},{"name":"box","mouse":[83,268]},{"name":"box","mouse":[79,261]},{"name":"box","mouse":[77,211]},{"name":"box","mouse":[77,168]},{"name":"box","mouse":[77,129]},{"name":"box","mouse":[76,117]}],

[{"name":"box","mouse":[79,108]},{"name":"box","mouse":[98,105]},{"name":"box","mouse":[178,105]},{"name":"box","mouse":[257,106]},{"name":"box","mouse":[277,108]},{"name":"box","mouse":[285,110]},{"name":"box","mouse":[286,119]},{"name":"box","mouse":[285,218]},{"name":"box","mouse":[285,263]},{"name":"box","mouse":[284,265]},{"name":"box","mouse":[273,264]},{"name":"box","mouse":[197,264]},{"name":"box","mouse":[131,262]},{"name":"box","mouse":[92,257]},{"name":"box","mouse":[88,256]},{"name":"box","mouse":[85,222]},{"name":"box","mouse":[81,172]},{"name":"box","mouse":[79,137]},{"name":"box","mouse":[79,113]},{"name":"box","mouse":[79,105]}],

[{"name":"box","mouse":[81,122]},{"name":"box","mouse":[91,118]},{"name":"box","mouse":[190,124]},{"name":"box","mouse":[291,129]},{"name":"box","mouse":[309,131]},{"name":"box","mouse":[313,152]},{"name":"box","mouse":[305,201]},{"name":"box","mouse":[298,255]},{"name":"box","mouse":[297,274]},{"name":"box","mouse":[292,276]},{"name":"box","mouse":[238,268]},{"name":"box","mouse":[185,266]},{"name":"box","mouse":[129,266]},{"name":"box","mouse":[101,265]},{"name":"box","mouse":[97,264]},{"name":"box","mouse":[97,219]},{"name":"box","mouse":[97,165]},{"name":"box","mouse":[95,134]},{"name":"box","mouse":[93,122]},{"name":"box","mouse":[93,116]}],

[{"name":"box","mouse":[101,102]},{"name":"box","mouse":[134,100]},{"name":"box","mouse":[237,104]},{"name":"box","mouse":[275,104]},{"name":"box","mouse":[283,105]},{"name":"box","mouse":[285,132]},{"name":"box","mouse":[285,197]},{"name":"box","mouse":[285,237]},{"name":"box","mouse":[286,278]},{"name":"box","mouse":[286,285]},{"name":"box","mouse":[249,284]},{"name":"box","mouse":[186,274]},{"name":"box","mouse":[121,263]},{"name":"box","mouse":[111,262]},{"name":"box","mouse":[108,234]},{"name":"box","mouse":[105,176]},{"name":"box","mouse":[101,130]},{"name":"box","mouse":[97,98]},{"name":"box","mouse":[97,88]},{"name":"box","mouse":[97,88]}]]

let circles = 

[[{"name":"circle","mouse":[163,93]},{"name":"circle","mouse":[197,92]},{"name":"circle","mouse":[270,122]},{"name":"circle","mouse":[292,160]},{"name":"circle","mouse":[292,226]},{"name":"circle","mouse":[257,278]},{"name":"circle","mouse":[169,300]},{"name":"circle","mouse":[75,283]},{"name":"circle","mouse":[61,234]},{"name":"circle","mouse":[64,192]},{"name":"circle","mouse":[80,134]},{"name":"circle","mouse":[101,97]},{"name":"circle","mouse":[133,82]},{"name":"circle","mouse":[148,81]},{"name":"circle","mouse":[172,83]},{"name":"circle","mouse":[205,90]},{"name":"circle","mouse":[205,90]},{"name":"circle","mouse":[205,90]},{"name":"circle","mouse":[202,90]},{"name":"circle","mouse":[181,85]}],

[{"name":"circle","mouse":[168,63]},{"name":"circle","mouse":[265,93]},{"name":"circle","mouse":[312,152]},{"name":"circle","mouse":[318,206]},{"name":"circle","mouse":[293,265]},{"name":"circle","mouse":[258,294]},{"name":"circle","mouse":[206,301]},{"name":"circle","mouse":[148,278]},{"name":"circle","mouse":[105,240]},{"name":"circle","mouse":[97,193]},{"name":"circle","mouse":[106,153]},{"name":"circle","mouse":[125,111]},{"name":"circle","mouse":[149,81]},{"name":"circle","mouse":[164,73]},{"name":"circle","mouse":[191,68]},{"name":"circle","mouse":[249,73]},{"name":"circle","mouse":[275,91]},{"name":"circle","mouse":[301,126]},{"name":"circle","mouse":[314,169]},{"name":"circle","mouse":[313,222]}],

[{"name":"circle","mouse":[169,87]},{"name":"circle","mouse":[222,95]},{"name":"circle","mouse":[276,125]},{"name":"circle","mouse":[309,186]},{"name":"circle","mouse":[309,249]},{"name":"circle","mouse":[286,281]},{"name":"circle","mouse":[212,307]},{"name":"circle","mouse":[170,304]},{"name":"circle","mouse":[123,262]},{"name":"circle","mouse":[95,217]},{"name":"circle","mouse":[90,158]},{"name":"circle","mouse":[109,113]},{"name":"circle","mouse":[130,85]},{"name":"circle","mouse":[153,81]},{"name":"circle","mouse":[207,82]},{"name":"circle","mouse":[235,93]},{"name":"circle","mouse":[253,109]},{"name":"circle","mouse":[293,188]},{"name":"circle","mouse":[289,217]},{"name":"circle","mouse":[219,290]}],

[{"name":"circle","mouse":[165,85]},{"name":"circle","mouse":[235,98]},{"name":"circle","mouse":[266,129]},{"name":"circle","mouse":[293,184]},{"name":"circle","mouse":[298,237]},{"name":"circle","mouse":[289,281]},{"name":"circle","mouse":[261,316]},{"name":"circle","mouse":[214,330]},{"name":"circle","mouse":[170,329]},{"name":"circle","mouse":[129,307]},{"name":"circle","mouse":[102,264]},{"name":"circle","mouse":[96,221]},{"name":"circle","mouse":[105,172]},{"name":"circle","mouse":[124,125]},{"name":"circle","mouse":[141,95]},{"name":"circle","mouse":[161,85]},{"name":"circle","mouse":[221,92]},{"name":"circle","mouse":[258,111]},{"name":"circle","mouse":[283,137]},{"name":"circle","mouse":[299,169]}],

[{"name":"circle","mouse":[187,94]},{"name":"circle","mouse":[255,109]},{"name":"circle","mouse":[296,157]},{"name":"circle","mouse":[321,231]},{"name":"circle","mouse":[317,284]},{"name":"circle","mouse":[293,331]},{"name":"circle","mouse":[259,339]},{"name":"circle","mouse":[169,329]},{"name":"circle","mouse":[129,305]},{"name":"circle","mouse":[101,242]},{"name":"circle","mouse":[98,196]},{"name":"circle","mouse":[117,145]},{"name":"circle","mouse":[144,121]},{"name":"circle","mouse":[180,106]},{"name":"circle","mouse":[207,105]},{"name":"circle","mouse":[239,111]},{"name":"circle","mouse":[261,123]},{"name":"circle","mouse":[285,144]},{"name":"circle","mouse":[302,185]},{"name":"circle","mouse":[307,228]}],

[{"name":"circle","mouse":[181,73]},{"name":"circle","mouse":[242,84]},{"name":"circle","mouse":[301,117]},{"name":"circle","mouse":[336,189]},{"name":"circle","mouse":[344,253]},{"name":"circle","mouse":[321,297]},{"name":"circle","mouse":[270,319]},{"name":"circle","mouse":[204,319]},{"name":"circle","mouse":[139,317]},{"name":"circle","mouse":[73,280]},{"name":"circle","mouse":[57,237]},{"name":"circle","mouse":[58,181]},{"name":"circle","mouse":[76,125]},{"name":"circle","mouse":[97,99]},{"name":"circle","mouse":[125,83]},{"name":"circle","mouse":[159,79]},{"name":"circle","mouse":[179,79]},{"name":"circle","mouse":[197,79]},{"name":"circle","mouse":[218,81]},{"name":"circle","mouse":[237,85]}],

[{"name":"circle","mouse":[194,41]},{"name":"circle","mouse":[261,46]},{"name":"circle","mouse":[305,80]},{"name":"circle","mouse":[333,133]},{"name":"circle","mouse":[345,185]},{"name":"circle","mouse":[340,252]},{"name":"circle","mouse":[316,290]},{"name":"circle","mouse":[286,312]},{"name":"circle","mouse":[239,320]},{"name":"circle","mouse":[164,305]},{"name":"circle","mouse":[115,273]},{"name":"circle","mouse":[82,221]},{"name":"circle","mouse":[69,181]},{"name":"circle","mouse":[70,129]},{"name":"circle","mouse":[89,91]},{"name":"circle","mouse":[106,69]},{"name":"circle","mouse":[129,50]},{"name":"circle","mouse":[168,39]},{"name":"circle","mouse":[197,38]},{"name":"circle","mouse":[211,38]}],

[{"name":"circle","mouse":[172,36]},{"name":"circle","mouse":[240,42]},{"name":"circle","mouse":[311,70]},{"name":"circle","mouse":[365,129]},{"name":"circle","mouse":[384,188]},{"name":"circle","mouse":[376,238]},{"name":"circle","mouse":[353,285]},{"name":"circle","mouse":[311,322]},{"name":"circle","mouse":[248,330]},{"name":"circle","mouse":[163,304]},{"name":"circle","mouse":[121,265]},{"name":"circle","mouse":[97,183]},{"name":"circle","mouse":[101,132]},{"name":"circle","mouse":[114,91]},{"name":"circle","mouse":[130,69]},{"name":"circle","mouse":[145,58]},{"name":"circle","mouse":[158,53]},{"name":"circle","mouse":[171,44]},{"name":"circle","mouse":[176,41]},{"name":"circle","mouse":[177,41]}],

[{"name":"circle","mouse":[191,33]},{"name":"circle","mouse":[262,34]},{"name":"circle","mouse":[317,66]},{"name":"circle","mouse":[347,133]},{"name":"circle","mouse":[350,215]},{"name":"circle","mouse":[328,301]},{"name":"circle","mouse":[289,346]},{"name":"circle","mouse":[241,341]},{"name":"circle","mouse":[191,324]},{"name":"circle","mouse":[141,277]},{"name":"circle","mouse":[120,225]},{"name":"circle","mouse":[124,167]},{"name":"circle","mouse":[133,128]},{"name":"circle","mouse":[146,100]},{"name":"circle","mouse":[157,72]},{"name":"circle","mouse":[164,58]},{"name":"circle","mouse":[173,45]},{"name":"circle","mouse":[180,41]},{"name":"circle","mouse":[182,38]},{"name":"circle","mouse":[187,37]}],

[{"name":"circle","mouse":[150,39]},{"name":"circle","mouse":[205,36]},{"name":"circle","mouse":[274,62]},{"name":"circle","mouse":[304,110]},{"name":"circle","mouse":[327,197]},{"name":"circle","mouse":[311,282]},{"name":"circle","mouse":[279,332]},{"name":"circle","mouse":[257,345]},{"name":"circle","mouse":[217,333]},{"name":"circle","mouse":[167,296]},{"name":"circle","mouse":[133,249]},{"name":"circle","mouse":[117,201]},{"name":"circle","mouse":[117,150]},{"name":"circle","mouse":[120,120]},{"name":"circle","mouse":[129,85]},{"name":"circle","mouse":[133,69]},{"name":"circle","mouse":[141,52]},{"name":"circle","mouse":[149,41]},{"name":"circle","mouse":[152,37]},{"name":"circle","mouse":[153,37]}]]

let classifer;

function setup() {
  ml5.setBackend("webgl");
  createCanvas(400, 400);
  frameRate(10);
  background(220);
  classifer = ml5.timeSeries();
}

function draw() {
  if (keyIsDown(67) && pressedOnce){
      sequence.push({"name":"circle","mouse": [mouseX,mouseY]});
      ellipse(mouseX,mouseY,10);
      if (sequence.length == 20){
        pressedOnce = false;
        datasets.push(sequence);
        sequence = [];
        console.log("finished");
        background(220);
      }
    
  } else if (keyIsDown(66) && pressedOnce){
      sequence.push({"name":"box","mouse": [mouseX,mouseY]});
      ellipse(mouseX,mouseY,10);
      if (sequence.length == 20){
        pressedOnce = false;
        datasets.push(sequence);
        sequence = [];
        console.log("finished");
        background(220);
      }
  }
  
  if (datasets.length == 10){
    file = JSON.stringify(datasets);
    console.log(file);
  }
}

function keyReleased(){
  pressedOnce = true;
}

function keyPressed(){
  if (key == 't'){
    classifer.createArchitecture();
    console.log('done architecture');
  } else if (key == 'y'){
    classifer.compileModel();
    console.log('done compiling the thing');
  } else if  (key == 'u'){
    classifer.summarizeModel();
    console.log('done summarizing');
  } else if (key == 'i'){
    classifer.fitModel();
    console.log('fitting done');
  }
}