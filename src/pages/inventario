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
import DatePicker from 'react-datepicker'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import { Box, IconButton, Input, InputAdornment } from '@mui/material'

import { IProducto } from 'src/interfaces'
import { API_URL } from 'src/configs/constans'
import { AuthResponse, AuthResponseError } from 'src/configs/types'

const Home = () => {

  const auth = useAuth();
  const [producto, setProducto] = useState<IProducto>({
    id: '',
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: 0,

  })

  const [oportunidades, setOportunidades] = useState([])
  const [errorResponse, setErrorResponse] = useState("")
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [img, setImg] = useState<File | null>(null)
  const CustomInput = forwardRef((props, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
  })

  useEffect(() => {
    getCompanyData();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setProducto({
      ...producto,
      [name]: value
    })
  }


  const handleChangeSelect = (e: SelectChangeEvent) => {
    const {name, value} = e.target;
    setProducto({
      ...producto,
      [name]: value
    })
  }


  async function handleSubmit() {
    //e.preventDefault();
    // auth.setIsAuthenticated(true);
    console.log(API_URL);
    if(producto.nombre == '' || producto.descripcion == ''){
      alert('debe llenar todos los campos')
      return 
    } else {
      try {
        if(producto.id != '' && producto.id != null) { //update producto
          const formData = new FormData();
          
          // Agregar cada campo del formulario al FormData
          Object.entries(producto).forEach(([key, value]) => {
            formData.append(key, value);
          });

          // Agregar la imagen al FormData solo si img no es nulo
          if (img !== null) {
            formData.append("file", img, img.name);
          }

          const response = await fetch(`${API_URL}/productos/${producto.id}`, {
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
        } else { //create producto
          const formData = new FormData();
          
          // Agregar cada campo del formulario al FormData
          Object.entries(producto).forEach(([key, value]) => {
            formData.append(key, value);
          });

          // Agregar la imagen al FormData solo si img no es nulo
          if (img !== null) {
            formData.append("file", img, img.name);
          }

          const response = await fetch(`${API_URL}/productos`, {
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
      const response = await fetch(`${API_URL}/productos?user=${auth.getUser()?.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const json = (await response.json()) as any;
        console.log(json);
        if(json && json.length > 0){
          const dataResponse = json[0];
          setProducto({
            id: dataResponse._id,
            nombre: dataResponse.nombre,
            imagen: dataResponse.imagen,
            descripcion: dataResponse.descripcion,
            precio: dataResponse.precio,
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
      const response = await fetch(`${API_URL}/productos/consultarLicitaciones/${auth.getUser()?.id}`, {
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

    
  const onChangeImage: ChangeEventHandler<HTMLInputElement> = (e) => {
      // Verifica si hay archivos seleccionados
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      let files = e.target.files;
      let name = files[0]?.name ?? "";

      setProducto((prev) => ({
        ...prev,
        imagen: name,
      }));
      setImg(files[0]);
    };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>

        <Card>
          <CardHeader title='Nuevo Producto' titleTypographyProps={{ variant: 'h1' }} />
            <CardContent>

            <Grid container spacing={6}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  type='text'
                  label='Nombre'
                  placeholder='nombre del producto'
                  value={producto.nombre}
                  name='nombre'
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label='Descripción'
                  placeholder='describe tu producto'
                  multiline
                  rows={2}
                  value={producto.descripcion}
                  name='descripcion'
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Imagen</InputLabel>
                <Input
                  type="file"
                  name="imagen"
                  onChange={onChangeImage}
                  inputProps={{ accept: 'image/*' }} // Puedes limitar la selección a archivos de imagen
                />
              </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type='text'
                  label='Precio'
                  placeholder='Indica el precio'
                  value={producto.precio}
                  name='precio'
                  onChange={handleChange}
                />
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
  )
}

export default Home