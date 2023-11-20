import React, {useState, useEffect, forwardRef, ChangeEventHandler} from 'react'
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
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import { Box, IconButton, Input, InputAdornment } from '@mui/material'

import { IInventario } from 'src/interfaces'
import { API_URL } from 'src/configs/constans'
import { AuthResponse, AuthResponseError } from 'src/configs/types'

const Home = () => {
    const auth = useAuth();
    const [inventario, setInventario] = useState<IInventario>({
        id: '',
        nombre: '',
        cantidad: 0,
        fecha_vencimiento: null,
      });

  const [oportunidades, setOportunidades] = useState([])
  const [errorResponse, setErrorResponse] = useState("")
  const [date, setDate] = useState<Date | null | undefined>(null)
  const CustomInput = forwardRef((props, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} label='Fecha de Vencimiento' autoComplete='off' />
  })

  useEffect(() => {
    getCompanyData();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInventario({
      ...inventario,
      [name]: value,
    });
  };

  const handleChangeSelect = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setInventario({
      ...inventario,
      [name || '']: value,
    });
  };


  async function handleSubmit() {
    console.log(API_URL);

    if (!inventario.nombre || (!inventario.cantidad && inventario.cantidad !== 0)) {
      alert('Debe llenar todos los campos');
      return;
    } else {
      try {
        if(inventario.id != '' && inventario.id != null) { //update inventario
          const formData = new FormData();

          // Agregar cada campo del formulario al FormData
          Object.entries(inventario).forEach(([key, value]) => {
            formData.append(key, value);
          });

          const response = await fetch(`${API_URL}/inventarios/${inventario.id}`, {
            method: "POST",
            //headers: { "Content-Type": "application/json" },
            //body: JSON.stringify(bodySend), // Agrega una coma aquí
            // body: formData // Puedes quitar esta línea si estás usando formData solo
          });
          if (response.ok) {
            const json = (await response.json()) as AuthResponse;
            console.log(json);
          } else {
            const json = (await response.json()) as AuthResponseError;
            setErrorResponse(json.body.error);
          }
        } else { //create inventario
          const formData = new FormData();

          // Agregar cada campo del formulario al FormData
          Object.entries(inventario).forEach(([key, value]) => {
            formData.append(key, value);
          });

          const response = await fetch(`${API_URL}/inventarios`, {
            method: "POST",
            //headers: { "Content-Type": "application/json" },
            //body: JSON.stringify(bodySend)
            body: formData
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
    try {
      const response = await fetch(`${API_URL}/inventarios?user=${auth.getUser()?.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const json = (await response.json()) as any;
        console.log(json);
        if(json && json.length > 0){
          const dataResponse = json[0];
          setInventario({
            id: dataResponse._id,
            nombre: dataResponse.nombre,
            cantidad: dataResponse.cantidad,
            fecha_vencimiento: dataResponse.fecha_vencimiento,
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

  const searchOpornunities = async () =>{
    try {
      const response = await fetch(`${API_URL}/inventarios/consultarLicitaciones/${auth.getUser()?.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const json = (await response.json()) as any;
        console.log(json);
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
          <CardHeader title='Agregar Producto' titleTypographyProps={{ variant: 'h1' }} />
            <CardContent>

            <Grid container spacing={6}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  type='text'
                  label='Nombre'
                  placeholder='nombre del producto'
                  value={inventario.id}
                  name='nombre'
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type='number'
                  label='Cantidad'
                  placeholder=''
                  value={inventario.cantidad}
                  name='cantidad'
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                {/* <DatePicker
                    id="fecha-vencimiento"
                    selected={inventario.fecha_vencimiento}
                    onChange={(date) => handleDateChange(date)}
                    dateFormat="yyyy-MM-dd"
                /> */}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                      sx={{
                        width: '100%'
                      }}
                      label={'Fecha de Vencimiento'}
                      value={inventario.fecha_vencimiento}
                      onChange={(newValue) => {
                        setInventario({
                          ...inventario,
                          fecha_vencimiento: newValue
                        })
                      }}
                    />
                  </LocalizationProvider>

                </Grid>

            </Grid>


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
  );
};

export default Home;
