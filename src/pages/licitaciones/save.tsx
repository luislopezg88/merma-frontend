import React, {useState, useEffect} from 'react'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { useRouter } from 'next/router'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs'
import { ILicitacion } from 'src/interfaces'
import { API_URL } from 'src/configs/constans'
import { AuthResponse, AuthResponseError } from 'src/configs/types'



const Save = () => {

  const router = useRouter()

  const [licitacion, setLicitacion] = useState<ILicitacion>({
    id: '',
    nombre: '',
    descripcion: '',
    inicio: null,
    fin: null,
    presupuesto: '',
    id_user: ''
  })
  const [errorResponse, setErrorResponse] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setLicitacion({
      ...licitacion,
      [name]: value
    })
  }

  const saveData = async () => {
    console.log(API_URL);
    if(licitacion.nombre == '' || licitacion.descripcion == ''){
      alert('debe llenar todos los campos')
      return
    } else {
      try {
        const bodySend = {
          ...licitacion
        }
        const response = await fetch(`${API_URL}/licitaciones`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodySend),
        });
        if (response.ok) {
          const json = (await response.json()) as AuthResponse;
          console.log(json);
          router.push('/licitaciones')
        } else {
          const json = (await response.json()) as AuthResponseError;
          setErrorResponse(json.body.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader title='Guardar Licitación' titleTypographyProps={{ variant: 'h1' }} />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type='text'
                    label='Nombre'
                    placeholder='Nombre de la licitaión'
                    value={licitacion.nombre}
                    name='nombre'
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    type='text'
                    label='Descripción'
                    placeholder='descripción de la licitación'
                    value={licitacion.descripcion}
                    name='descripcion'
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        width: '100%'
                      }}
                      label={'Fecha de inicio'}
                      value={licitacion.inicio} onChange={(newValue) => {
                        setLicitacion({
                          ...licitacion,
                          inicio: newValue
                        })
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        width: '100%'
                      }}
                      label={'Fecha de culminación'}
                      value={licitacion.fin} onChange={(newValue) => {
                        setLicitacion({
                          ...licitacion,
                          fin: newValue
                        })
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type='Presupuesto'
                    label='presupuesto'
                    value={licitacion.presupuesto}
                    name='presupuesto'
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box>
                    <Button size='large' type='button' variant='contained' onClick={() => saveData()} >
                      Guardar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Save;
