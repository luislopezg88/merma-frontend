import React, {useState, useEffect, forwardRef, ChangeEventHandler} from 'react'
import { useAuth } from '../context/AuthProvider'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'


import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Alert, Box, Input } from '@mui/material'

import { IProducto } from 'src/interfaces'
import { API_URL } from 'src/configs/constans'
import { AuthResponse, AuthResponseError, IResponseError } from 'src/configs/types'
import { AlertColor } from '@mui/material'

interface IMessage  {
  show: boolean;
  text: string;
  type: AlertColor
}

const Producto = () => {
  const auth = useAuth();
  const [producto, setProducto] = useState<IProducto>({
    id: '',
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: 0,

  })

  const [errorResponse, setErrorResponse] = useState("")
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [img, setImg] = useState<File | null>(null)
  const CustomInput = forwardRef((props, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
  })
  const [message, setMessage] = useState<IMessage>({
    show: false,
    text: '',
    type: 'success'
  })
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    
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
      //alert('debe llenar todos los campos')
      setMessage({
        show: true,
        text: 'Debe llenar el nombre y la descripción',
        type: 'error'
      })
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

          const response = await fetch(`${API_URL}/productos`, { //${producto.id}
            method: "POST",
            //headers: { "Content-Type": "application/json" },
            //body: JSON.stringify(bodySend)
            body: formData
          });
          if (response.ok) {
            const json = (await response.json()) as AuthResponse;
            console.log(json);
            setTimeout(() => {
              setMessage({
                show: true,
                text: 'Datos actualizados correctamente',
                type: 'success'
              })
            }, 1000);
          } else {
            const json = (await response.json()) as IResponseError;
            setTimeout(() => {
              setMessage({
                show: true,
                text: json.error,
                type: 'error'
              })
            }, 1000);
            setErrorResponse(json.error);
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
            setTimeout(() => {
              setMessage({
                show: true,
                text: 'Datos actualizados correctamente',
                type: 'success'
              })
            }, 1000);
          } else {
            const json = (await response.json()) as IResponseError;
            setTimeout(() => {
              setMessage({
                show: true,
                text: json.error,
                type: 'error'
              })
            }, 1000);
            setErrorResponse(json.error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
    
  const onChangeImage: ChangeEventHandler<HTMLInputElement> = (e) => {
      // Verifica si hay archivos seleccionados
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const files = e.target.files;
      const name = files[0]?.name ?? "";

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

            {message.show &&
            <Grid container spacing={6}>
              <Grid item xs={12} sm={12} sx={{ mt: 6 }} >
                <Alert
                  variant="filled" severity={message.type} 
                  onClose={() => {
                    setMessage({
                      ...message,
                      show: false
                    })
                  }}
                >
                  { message.text }
                </Alert>
              </Grid> 
            </Grid>
            }
            
          </CardContent>
        </Card>

      </Grid>
    </Grid>
  )
}

export default Producto