import React, {useState, useEffect} from 'react'
import { useAuth } from '../context/AuthProvider'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'


import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'

import { IMayorista } from 'src/interfaces'
import { API_URL } from 'src/configs/constans'
import { AuthResponse, AuthResponseError } from 'src/configs/types'

const Home = () => {

  const auth = useAuth();
  const [mayorista, setmayorista] = useState<IMayorista>({
    id_mayorista: '',
    nombre_mayorista: '',
    descripcion: '',
    telefono: '',
    ubicacion: '',
    id_user: ''
  })
  const [errorResponse, setErrorResponse] = useState("")

  useEffect(() => {
    getCompanyData();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setmayorista({
      ...mayorista,
      [name]: value
    })
  }


  const handleChangeSelect = (e: SelectChangeEvent) => {
    const {name, value} = e.target;
    setmayorista({
      ...mayorista,
      [name]: value
    })
  }

  async function handleSubmit() {
    //e.preventDefault();
    // auth.setIsAuthenticated(true);
    console.log(API_URL);
    if(mayorista.nombre_mayorista == '' || mayorista.descripcion == ''){
      alert('debe llenar todos los campos')
      return
    } else {
      try {
        if(mayorista.id_mayorista != '' && mayorista.id_mayorista != null) { //update mayorista
          const bodySend = {
            ...mayorista
          }
          const response = await fetch(`${API_URL}/mayoristas/save/${mayorista.id_mayorista}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodySend)
          });
          if (response.ok) {
            const json = (await response.json()) as AuthResponse;
            console.log(json);
          } else {
            const json = (await response.json()) as AuthResponseError;
            setErrorResponse(json.body.error);
          }
        } else { //create mayorista
          const bodySend = {
            ...mayorista,
            id_user: auth.getUser()?.id
          }
          const response = await fetch(`${API_URL}/mayoristas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodySend)
          });
          if (response.ok) {
            const json = (await response.json()) as AuthResponse;
            console.log(json);
          } else {
            const json = (await response.json()) as AuthResponseError;
            setErrorResponse(json.body.error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const getCompanyData = async () =>{
    console.log(auth.getUser()?.id);
    try {
      const response = await fetch(`${API_URL}/mayoristas?id_user=${auth.getUser()?.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const json = (await response.json()) as any;
        console.log(json);
        if(json && json.length > 0){
          const dataResponse = json[0];
          setmayorista({
            id_mayorista: dataResponse._id,
            nombre_mayorista: dataResponse.nombre,
            descripcion: dataResponse.descripcion,
            telefono: dataResponse.telefono,
            ubicacion: dataResponse.ubicacion,
            id_user: dataResponse.id_user,
          })
        }
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>

        <Card>
          <CardHeader title='Datos de la mayorista' titleTypographyProps={{ variant: 'h1' }} />
            <CardContent>

            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type='text'
                  label='Nombre'
                  placeholder='nombre de la mayorista'
                  value={mayorista.nombre_mayorista}
                  name='nombre'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Tipo de mayorista</InputLabel>
                  <Select
                    label='Tipo de mayorista'
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                    value={mayorista.descripcion}
                    name='tipo'
                    onChange={handleChangeSelect}
                  >
                    <MenuItem value='micromayorista'>Micromayoristas</MenuItem>
                    <MenuItem value='pyme'>Pequeñas y medianas mayoristas (PYME)</MenuItem>
                    <MenuItem value='grande'>Grandes mayoristas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label='Descripción'
                  placeholder='describe tu mayorista'
                  multiline
                  rows={2}
                  value={mayorista.telefono}
                  name='descripcion'
                  onChange={handleChange}
                />
              </Grid>

            </Grid>

            <Divider sx={{ mt: 5, mb: 5 }} />

            <Grid container spacing={6}>
              <Grid item xs={12} sm={12}>
                <Box
                  style={{
                    marginTop: 20
                  }}
                >
                  <Button size='large' type='button' variant='contained' onClick={() => handleSubmit()} >
                    Guardar
                  </Button>
                </Box>
              </Grid>
            </Grid>

          </CardContent>
        </Card>

      </Grid>
    </Grid>
  )
}

export default Home
