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
import { Scatter } from 'react-chartjs-2';


import { LinearProgressWithLabel } from "./components/LinearProgressWithLabel.js"
import logo from "./assets/penguin_waving.gif"
import './Home.css';

import { MentalHealthSDK } from "./sdk/MentalHealth.js"

const mhsdk = new MentalHealthSDK()



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
const updateTimeMs = 60*1000;

//TODO REMOVE

console.log(mhsdk.datasrc);
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

var datagps = {
  datasets: [
    {
      label: 'GPS Location',
      data: mhsdk.datasrc.filter(x=>x.type=="gps").map(dp=>({x:dp.data.latitude,y:dp.data.longitude}))
      ,
    },
    
  ],
};


//REMOVE


export default function Home() {
  const [lastRendered, setLastRendered] = useState(0);
  setInterval(()=>{setLastRendered((new Date).getTime())},updateTimeMs)


  return (
    <div>
      <Card sx={cardStyle}>
      <Typography gutterBottom variant="h4" component="div">
          Penguin Mental Health
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
          Happiness
        </Typography>
        <LinearProgressWithLabel value={42} />
        <Typography gutterBottom variant="body2" component="div">
          Calmness
        </Typography>
        <LinearProgressWithLabel value={30} />
        <Typography gutterBottom variant="body2" component="div">
          Happiness
        </Typography>
        <LinearProgressWithLabel value={60} />
      </CardContent>
      
      
      <CardActions>
        <Button variant="contained">Your Charts</Button>
        <Button variant="contained">Your Data</Button>
      </CardActions>
    </Card>
    <Card sx={cardStyle}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Survey Name Mental Health
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained">😔</Button><Button variant="contained">😐</Button><Button variant="contained">😊</Button>
      </CardActions>
    </Card>
    
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
        <Scatter data={data}
        />
      <Scatter data={todaysdata}
        />
        <Scatter data={daysdata}
        />
        <Scatter data={datagps}
        />
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
