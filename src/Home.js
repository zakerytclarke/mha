import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import { Scatter, Bubble } from 'react-chartjs-2';


import { LinearProgressWithLabel } from "./components/LinearProgressWithLabel.js"
import { LinearProgress } from '@mui/material';
import logo from "./assets/penguin_waving.gif"
import './Home.css';

import { MentalHealthSDK } from "./sdk/MentalHealth.js"

const mhsdk = new MentalHealthSDK()

const colorPalette = {            
  backgroundColor: [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ],
  borderColor: [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ]
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
const mW = 400;

const cardStyle = { 
  m:2, 
  p:1,
  width:"87%",
  maxWidth: "500px",
  color: "#fff",
  textShadow:"1px 1px #ccc",
  backgroundColor:"#ffffff55",
  backdropFilter: "blur(50px)",
  border: "2px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 0 80px rgba(0, 0, 0, 0.2)",
  borderRadius:"2vmin"
}
const updateTimeMs = 30*1000;

//TODO REMOVE

var data = {
  datasets: [
    {
      label: 'GPS Coverage',
      data: mhsdk.datasrc.filter(x=>x.type=="gps").map(dp=>({x:dp.ts,y:0})),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
    {
      label: 'Battery Coverage',
      data: mhsdk.datasrc.filter(x=>x.type=="battery").map(dp=>({x:dp.ts,y:1})),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
    {
      label: 'Gyroscope Coverage',
      data: mhsdk.datasrc.filter(x=>x.type=="gyroscope").map(dp=>({x:dp.ts,y:2})),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
  ],
};

var start = new Date();
start.setUTCHours(0,0,0,0);

var end = new Date();
end.setUTCHours(23,59,59,999);

var todaysdatasrc = mhsdk.datasrc.filter(x=>x.ts>start.getTime()&&x.ts<end.getTime())

var todaysdata = {
  datasets: [
    {
      label: 'GPS Coverage',
      data: todaysdatasrc.filter(x=>x.type=="gps").map(dp=>({x:dp.ts,y:0})).concat([{x:start.getTime(),y:0},{x:end.getTime(),y:0}]),
      backgroundColor: 'rgba(255, 99, 132, 1)',

  showLine: true
    },
    {
      label: 'Battery Coverage',
      data: todaysdatasrc.filter(x=>x.type=="battery").map(dp=>({x:dp.ts,y:1})),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
    {
      label: 'Gyroscope Coverage',
      data: todaysdatasrc.filter(x=>x.type=="gyroscope").map(dp=>({x:dp.ts,y:2})),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
  ],
  showLine: true
};

var daysdata = {
  datasets: [
    {
      label: 'GPS Coverage',
      data: todaysdatasrc.filter(x=>x.type=="gps").map(dp=>({x:dp.ts,y:0})),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
    {
      label: 'Battery Coverage',
      data: todaysdatasrc.filter(x=>x.type=="battery").map(dp=>({x:dp.ts,y:1})),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
    {
      label: 'Gyroscope Coverage',
      data: todaysdatasrc.filter(x=>x.type=="gyroscope").map(dp=>({x:dp.ts,y:2})),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
  ],
};




//REMOVE


export default function Home() {
  const [lastRendered, setLastRendered] = useState(0);
  // setInterval(()=>{setLastRendered((new Date).getTime())},updateTimeMs)
  mhsdk.register_callback(setLastRendered)
  var datagps = {
    datasets: [
      {
        type:'scatter',
        label: 'GPS Location',
        data: (mhsdk.computed_features.gps_data||[]).map(dp=>({x:dp.latitude,y:dp.longitude})),
        showLine: true
      },
      {
        label: 'Home Location',
        data: (mhsdk.computed_features.home_location||[]).map(dp=>({x:dp.latitude,y:dp.longitude,r:Math.min(24,dp.time_at_location/1000/60/60)})),
        borderColor: colorPalette.borderColor[5],
        backgroundColor: colorPalette.backgroundColor[5], 
      },
      {
        label: 'Work Location',
        data: (mhsdk.computed_features.work_location||[]).map(dp=>({x:dp.latitude,y:dp.longitude,r:Math.min(24,dp.time_at_location/1000/60/60)})),
        borderColor: colorPalette.borderColor[2],
        backgroundColor: colorPalette.backgroundColor[2], 
      },
      {
        type:'scatter',
        label: 'GPS Cluster Path',
        data: (mhsdk.computed_features.poi_gps_cluster||[]).map(dp=>({x:dp.latitude,y:dp.longitude})),
        showLine: true,
        borderColor: colorPalette.borderColor[1],
        backgroundColor: colorPalette.backgroundColor[1], 
      },
      {
        label: 'GPS Clusters',
        data: (mhsdk.computed_features.poi_gps_cluster||[]).map(dp=>({x:dp.latitude,y:dp.longitude,r:Math.min(24,dp.time_at_location/1000/60/60)})),
        showLine: true,
        borderColor: colorPalette.borderColor[1],
        backgroundColor: colorPalette.backgroundColor[1], 
        fillColor: colorPalette.backgroundColor[1], 
      },

      
    ],
    options:{
      responsive:false,
      aspectRatio:1,
    }
  
  };

  return (
    <div>
      <Card sx={cardStyle}>
      <Typography gutterBottom variant="h4" component="div">
          Igloo Mental Health
      </Typography>
      <CardMedia
        component="img"
        alt="penguin waving"
        height="400"
        image={logo}
      />
      <CardContent>


        <Typography gutterBottom variant="p" component="div">
          Mental Health Stats
        </Typography>
        <Typography gutterBottom variant="body2" component="div">
          Happiness (Depression)
        </Typography>
        <LinearProgressWithLabel value={(mhsdk.computed_features.depression_score||[{score:0}])[0].score*100} style={{height:15}}/>
        <Typography gutterBottom variant="body2" component="div">
          Calmness (Anxiety)
        </Typography>
        <LinearProgressWithLabel value={30} style={{height:15}}/>
        <Typography gutterBottom variant="body2" component="div">
          Control (Mania)
        </Typography>
        <LinearProgressWithLabel value={60} style={{height:15}}/>
        <Typography gutterBottom variant="body2" component="div">
          Coverage
        </Typography>
        <LinearProgress variant="determinate" value={30} style={{height:15,width:100/8+"%",display:"inline-block",border:"1px black solid"}}/>
        <LinearProgress variant="determinate" value={30} style={{height:15,width:100/8+"%",display:"inline-block",border:"1px black solid"}}/>
        <LinearProgress variant="determinate" value={30} style={{height:15,width:100/8+"%",display:"inline-block",border:"1px black solid"}}/>
        <LinearProgress variant="determinate" value={30} style={{height:15,width:100/8+"%",display:"inline-block",border:"1px black solid"}}/>
        <LinearProgress variant="determinate" value={30} style={{height:15,width:100/8+"%",display:"inline-block",border:"1px black solid"}}/>
        <LinearProgress variant="determinate" value={30} style={{height:15,width:100/8+"%",display:"inline-block",border:"1px black solid"}}/>
        <LinearProgress variant="determinate" value={30} style={{height:15,width:100/8+"%",display:"inline-block",border:"1px black solid"}}/>
        
      </CardContent>
{/*       
      
      <CardActions>
        <Button variant="contained">Your Charts</Button>
        <Button variant="contained">Your Data</Button>
      </CardActions> */}
    </Card>

    {
      mhsdk.computed_features.surveys_to_display.map(function(x){
        return (
          <Card sx={cardStyle}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {x.text}
            </Typography>
          </CardContent>
    
          <CardActions>
            {
              x.answers.map(function(y){
                return (<Button variant="contained" onClick={function(){
                  console.log(x);
                  x.answer = y;
                  mhsdk._save_data("survey",x)
                //Update any features that might exist
                mhsdk.compute_features();
                }}>{y}</Button>);
              })
            }
          </CardActions>
        </Card>
        )
      })
    }


    
    <Card  sx={cardStyle}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Mental Health Tip:
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Did you know? You are twice as likely to experience depression if you get less than 8 hours of sleep every day.
        </Typography>
      </CardContent>


    </Card>

    <Card  sx={cardStyle}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Sleep Schedule Name Mental Health
        </Typography>
        <Scatter data={data}/>
        <Scatter data={todaysdata}/>
        <Scatter data={daysdata}/>
        
      </CardContent>
    </Card>

    <Card sx={cardStyle}>
      <CardContent>
      <Bubble data={datagps} height={300}/>
      </CardContent>
    </Card>
    


    
    <Card  sx={cardStyle}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Data Privacy
        </Typography>
        <Typography gutterBottom variant="p" component="div">Datapoints collected: {mhsdk.datasrc.length}</Typography>
        <Typography gutterBottom variant="p" component="div">Memory Utilized: {(JSON.stringify(mhsdk.datasrc).length/1000000).toFixed(2)}mb</Typography>
        
        <Typography gutterBottom variant="p" component="div">We care about your data privacy. You can view and manage your local data storage at any time.</Typography>
        <br />
        <Button variant="contained" onClick={()=>{download("mha.json",JSON.stringify(mhsdk.datasrc))}}>Export My Data</Button>
        <br />
        <br />
        <Button variant="contained">Reset My Data</Button>
        
      </CardContent>
    </Card>
    </div>
    
    
  );
}
