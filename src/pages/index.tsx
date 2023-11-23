import React, {useState, useEffect} from 'react'
import { useAuth } from '../context/AuthProvider'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { AlertColor } from '@mui/material'

interface IMessage  {
  show: boolean;
  text: string;
  type: AlertColor
}

const Home = () => {
  const auth = useAuth();
  

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>

        <Card>
          <CardHeader title='Datos de la empresa' titleTypographyProps={{ variant: 'h1' }} />
            <CardContent>

            
          </CardContent>
        </Card>

      </Grid>
    </Grid>
  )
}

export default Home