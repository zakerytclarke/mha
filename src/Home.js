import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

import { LinearProgressWithLabel } from "./components/LinearProgressWithLabel.js"

import './Home.css';

import logo from "./assets/penguin_waving.gif"

export default function Home() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="penguin waving"
        height="100"
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
      
      <CardActions>
        <Button variant="contained">😔</Button><Button variant="contained">😐</Button><Button variant="contained">😊</Button>
      </CardActions>
    </Card>
  );
}
