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
import Chip from '@mui/material/Chip'
import { Box } from '@mui/material'

import { IEmpresa } from 'src/interfaces'
import { finalidades } from 'src/moks/finalidades'
import { instrumentos } from 'src/moks/instrumentos'
import { administraciones } from 'src/moks/administraciones'
import { organos } from 'src/moks/organos'
import { API_URL } from 'src/configs/constans'
import { AuthResponse, AuthResponseError } from 'src/configs/types'

const Home = () => {

  const auth = useAuth();
  const [empresa, setempresa] = useState<IEmpresa>({
    id: '',
    nombre: '',
    descripcion: '',
    finalidad: '',
    tipo: '',
    empleados: '',
    instrumento: '',
    tags: [],
    id_user: ''
  })
  const [tag, setTag] = useState<string>('')
  const [oportunidades, setOportunidades] = useState([])
  const [errorResponse, setErrorResponse] = useState("")

  useEffect(() => {
    getCompanyData();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setempresa({
      ...empresa,
      [name]: value
    })
  }


  const handleChangeSelect = (e: SelectChangeEvent) => {
    const {name, value} = e.target;
    setempresa({
      ...empresa,
      [name]: value
    })
  }

  const addTag = () => {
    if(tag == ''){
      return
    }
    let currentTags: Array<string> = [];
    currentTags = empresa.tags ? empresa.tags : []
    currentTags.push(tag)
    setempresa({
      ...empresa,
      tags: currentTags
    })
    setTag('')
  }

  const handleDelete = (index: number) => {
    let currentTags: Array<string> = [];
    if(empresa.tags){
      currentTags = empresa.tags
    }
    currentTags.splice(index, 1);
    setempresa({
      ...empresa,
      tags: currentTags
    })
  }

  async function handleSubmit() {
    //e.preventDefault();
    // auth.setIsAuthenticated(true);
    console.log(API_URL);
    if(empresa.nombre == '' || empresa.descripcion == ''){
      alert('debe llenar todos los campos')
      return 
    } else {
      try {
        if(empresa.id != '' && empresa.id != null) { //update empresa
          const bodySend = {
            ...empresa,
            empleados: parseInt(empresa?.empleados, 10),
            tags: JSON.stringify(empresa.tags),
          }
          const response = await fetch(`${API_URL}/empresas/save/${empresa.id}`, {
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
        } else { //create empresa
          const bodySend = {
            ...empresa,
            empleados: parseInt(empresa?.empleados, 10),
            tags: JSON.stringify(empresa.tags),
            id_user: auth.getUser()?.id
          }
          const response = await fetch(`${API_URL}/empresas`, {
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
    try {
      const response = await fetch(`${API_URL}/empresas?user=${auth.getUser()?.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const json = (await response.json()) as any;
        console.log(json);
        if(json && json.length > 0){
          const dataResponse = json[0];
          setempresa({
            id: dataResponse._id,
            nombre: dataResponse.nombre,
            tipo: dataResponse.tipo,
            descripcion: dataResponse.descripcion,
            tags: JSON.parse(dataResponse.tags),
            empleados: dataResponse.empleados,
            id_user: dataResponse.id_user,
            finalidad: dataResponse.finalidad,
            instrumento: dataResponse. instrumento,
            administracion: dataResponse. administracion,
            organo: dataResponse. organo
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
      const response = await fetch(`${API_URL}/empresas/consultarLicitaciones/${auth.getUser()?.id}`, {
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
          <CardHeader title='Datos de la empresa' titleTypographyProps={{ variant: 'h1' }} />
            <CardContent>

            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type='text'
                  label='Nombre'
                  placeholder='nombre de la empresa'
                  value={empresa.nombre}
                  name='nombre'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Tipo de empresa</InputLabel>
                  <Select
                    label='Tipo de empresa'
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                    value={empresa.tipo}
                    name='tipo'
                    onChange={handleChangeSelect}
                  >
                    <MenuItem value='microempresa'>Microempresas</MenuItem>
                    <MenuItem value='pyme'>Pequeñas y medianas empresas (PYME)</MenuItem>
                    <MenuItem value='grande'>Grandes empresas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label='Descripción'
                  placeholder='describe tu empresa'
                  multiline
                  rows={2}
                  value={empresa.descripcion}
                  name='descripcion'
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type='number'
                  label='N° de empleados'
                  value={empresa.empleados}
                  name='empleados'
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Finalidad</InputLabel>
                  <Select
                    label='Finalidad'
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                    value={empresa.finalidad}
                    name='finalidad'
                    onChange={handleChangeSelect}
                  >
                    {finalidades.map((f: any, index: number) => (
                      <MenuItem value={f.keyword} key={f.keyword + '-'+ index}>{f.descripcion}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Instrumento</InputLabel>
                  <Select
                    label='Instrumento'
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                    value={empresa.instrumento}
                    name='instrumento'
                    onChange={handleChangeSelect}
                  >
                    {instrumentos.map((i: any, index: number) =>(
                      <MenuItem value={i.keyword} key={i.keyword}>{i.descripcion}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Administración</InputLabel>
                  <Select
                    label='Administración'
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                    value={empresa.administracion}
                    name='administracion'
                    onChange={handleChangeSelect}
                  >
                    {administraciones.map((f: any, index: number) => (
                      <MenuItem value={f.keyword} key={f.keyword + '-'+ index}>{f.descripcion}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Órgano</InputLabel>
                  <Select
                    label='Órgano'
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                    value={empresa.organo}
                    name='organo'
                    onChange={handleChangeSelect}
                  >
                    {organos.map((f: any, index: number) => (
                      <MenuItem value={f.keyword} key={f.keyword + '-'+ index}>{f.descripcion}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

            <Divider sx={{ mt: 5, mb: 5 }} />

            <Grid container spacing={6}>
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant='h6' sx={{ mb: 5 }}>
                    Tags
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <Grid container spacing={6}>
                      <Grid item xs={12} md={8}>
                        <TextField
                          fullWidth
                          type='text'
                          label='Nombre'
                          placeholder='Escribe algún interes'
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                        />
                      </Grid> 
                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: '100%',
                            alignItems: 'center'
                          }}
                        >
                          <Button size='large' type='button' variant='contained' onClick={() => addTag()} >
                            Añadir Tag
                          </Button>
                        </Box>
                      </Grid>                
                      <Grid item xs={12} md={12}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap'
                          }}
                        >
                          {empresa.tags.map((t: string, index: number) => (
                            <Chip label={t} variant="outlined" sx={{ mr: 5 }} onDelete={() => handleDelete(index)}  key={t+ '-'+ index}/>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>                                
                </Box>
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

        <Card
          sx={{
            mt: 10
          }}
        >
          <CardHeader title='Oportunudades de negocio' titleTypographyProps={{ variant: 'h1' }} />
            <CardContent>

              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <Box
                    style={{
                      marginTop: 20
                    }}
                  >
                    <Button size='large' type='button' variant='contained' onClick={() => searchOpornunities()} >
                      Buscar Oportunides
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
