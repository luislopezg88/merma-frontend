// ** React Imports
import { useState, Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthProvider'

// ** MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { Dayjs } from 'dayjs'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import { Button, CardContent } from '@mui/material'
import { API_URL } from 'src/configs/constans'
import { AuthResponseError } from 'src/configs/types'
import { ILicitacion } from 'src/interfaces'

const createData = (_id: string, nombre: string, inicio: Dayjs, fin: Dayjs, presupuesto: string, protein: number, price: number) => {
  return {
    _id,
    nombre,
    inicio,
    fin,
    presupuesto,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1
      }
    ]
  }
}


const Row = (props: { row: ReturnType<typeof createData> }) => {
  // ** Props
  const { row } = props

  // ** State
  const [open, setOpen] = useState<boolean>(false)


  const expandCollapse = () => {
    setOpen(!open)
  }


  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => expandCollapse()}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {row.nombre}
        </TableCell>
        <TableCell>{row.inicio}</TableCell>
        <TableCell>{row.fin}</TableCell>
        <TableCell align='right'>{row.presupuesto}</TableCell>
        <TableCell>{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: '0 !important' }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Convocatorias
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align='right'>Amount</TableCell>
                    <TableCell align='right'>Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map(historyRow => (
                    <TableRow key={historyRow.date}>
                      <TableCell component='th' scope='row'>
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align='right'>{historyRow.amount}</TableCell>
                      <TableCell align='right'>{Math.round(historyRow.amount * row.price * 100) / 100}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

/*const rows = [
  createData('Licitacion1', '2023-08-11', '2023-08-11', '24', 4.0, 3.99),
  createData('Licitacion12', '2023-08-11', '2023-08-11', '37', 4.3, 4.99),
  createData('Licitacion3', '2023-08-11', '2023-08-11', '24', 6.0, 3.79),
  createData('Licitacion4', '2023-08-11', '2023-08-11', '67', 4.3, 2.5),
  createData('Licitacion5', '2023-08-11', '2023-08-11', '49', 3.9, 1.5)
]*/



const Licitaciones = () => {

  const router = useRouter()
  const auth = useAuth()

  const [errorResponse, setErrorResponse] = useState("")
  const [licitaciones, setLicitaciones] = useState([]);

  useEffect(() => {
    
  }, [])

  return ( 

    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader title='Mis licitaciones' titleTypographyProps={{ variant: 'h1' }} />
          <CardContent>
            <Box 
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >

              <Button size='large' type='button' variant='contained' 
                onClick={() => {
                  router.push('/licitaciones/save')
                }} 
              >
                Crear Licitación
              </Button>

            </Box>
            <TableContainer component={Paper}>
              <Table aria-label='collapsible table'>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Nombre</TableCell>
                    <TableCell>Inicio</TableCell>
                    <TableCell>Culminación</TableCell>
                    <TableCell align='right'>Presupuesto</TableCell>
                    <TableCell>Protein (g)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {licitaciones.map((row: any) => (
                    <Row key={row.nombre} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
 
export default Licitaciones;