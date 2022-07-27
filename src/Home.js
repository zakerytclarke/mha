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
        <Typography variant="body2" color="text.secondary">
          How are you feeling today?
        </Typography>
      </CardContent>
      <LinearProgressWithLabel value={42} />
      <LinearProgressWithLabel value={30} />
      <LinearProgressWithLabel value={60} />
      
      <CardActions alignItems="center">
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
          Sleep Schedule Name Mental Health
        </Typography>
        <Line data={data}
        />
      </CardContent>
    </Card>
    <Card sx={{ m:2, maxWidth: 345, textAlign:"center" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
         Show me ze Data
        </Typography>
        <Typography gutterBottom variant="h5" component="div">{(JSON.stringify(mhsdk.datasrc).length/5000000)*100}%</Typography>
        
        <Typography gutterBottom variant="h5" component="div">{JSON.stringify(mhsdk.datasrc,null,2)}</Typography>
        
      </CardContent>
    </Card>
    </div>
    
    
  );
}
