import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import { Line } from 'react-chartjs-2';


import { LinearProgressWithLabel } from "./components/LinearProgressWithLabel.js"
import logo from "./assets/penguin_waving.gif"
import './Home.css';

import { MentalHealthSDK } from "./sdk/MentalHealth.js"

const mhsdk = new MentalHealthSDK()

var data = {
  labels:["1","2","3"],
  datasets: [
    {
      label: 'Dataset 1',
      data: [1,2,3],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
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

export default function Home() {
  return (
    <div>
      <Card sx={{ m:2, maxWidth: 500 }} >
      <CardMedia
        component="img"
        alt="penguin waving"
        height="400"
        image={logo}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Penguin Mental Health
        </Typography>

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
    <Card sx={{ m:2, maxWidth: 345, textAlign:"center" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Survey Name Mental Health
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained">😔</Button><Button variant="contained">😐</Button><Button variant="contained">😊</Button>
      </CardActions>
    </Card>
    <Card sx={{ m:2, maxWidth: 345, textAlign:"center" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Survey Name Mental Health
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained">😔</Button><Button variant="contained">😐</Button><Button variant="contained">😊</Button>
      </CardActions>
    </Card>
    <Card sx={{ m:2, maxWidth: 345, textAlign:"center" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Survey Name Mental Health
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained">😔</Button><Button variant="contained">😐</Button><Button variant="contained">😊</Button>
      </CardActions>
    </Card>
    <Card sx={{ m:2, maxWidth: 345, textAlign:"center" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Survey Name Mental Health
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained">😔</Button><Button variant="contained">😐</Button><Button variant="contained">😊</Button>
      </CardActions>
    </Card>
    <Card sx={{ m:2, maxWidth: 345, textAlign:"center" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Mental Health Tip:
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Did you know? You are twice as likely to experience depression if you get less than 8 hours of sleep every day.
        </Typography>
      </CardContent>


    </Card>

    <Card sx={{ m:2, maxWidth: 345, textAlign:"center" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Sleep Schedule Name Mental Health
        </Typography>
        <Line data={data}
        />
      </CardContent>
    </Card>
    <Card sx={{ m:2, maxWidth: 345, textAlign:"center" }}>
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
