// ** MUI Imports
import React, { useState, SyntheticEvent, useEffect } from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { IProducto, IMayorista } from 'src/interfaces' // Ajusta según tu interfaz real
import { API_URL } from 'src/configs/constans'

// ** Demo Components Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import { Box, Menu, Radio } from '@mui/material';

const CardBasic = () => {
    const [productos, setProductos] = useState<IProducto[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<IProducto | null>(null);
    const [selectedMayoristas, setSelectedMayoristas] = useState<{ [key: string]: string | null }>({});
    const [carrito, setCarrito] = useState<IProducto[]>([]);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)
    // ** Hooks
    const router = useRouter()

    useEffect(() => {
        getProducts();
    }, []); // Se ejecutará solo una vez al montar el componente

    const getProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/productos/tiendaProductos`);
            const result = await response.json();

            if (result.statuscode === 200) {
                const { data } = result.body;
                setProductos(data);
            } else {
                console.error('Error en la respuesta del servidor:', result);
            }
        } catch (error) {
          console.error('Error al obtener productos:', error);
          throw error; // Puedes manejar el error según tus necesidades
        }
    };

    const handleProductChange = (producto: IProducto, mayorista: IMayorista) => {
        //console.log('Producto seleccionado:', producto);
        //console.log('Mayorista seleccionado:', mayorista);
    
        // Actualiza el estado con el producto y mayorista seleccionados
        setSelectedProduct({
          ...producto,
          mayoristas: [mayorista],
        });
    
        // Almacena el ID del mayorista seleccionado para el producto actual
        setSelectedMayoristas((prevMayoristas) => ({
          ...prevMayoristas,
          [producto.id]: mayorista.id_mayorista,
        }));
    };

    const handleAgregarAlCarrito = () => {
        if (selectedProduct) {
            setCarrito((prevCarrito) => [...prevCarrito, selectedProduct]);
            // Limpia la selección actual después de agregar al carrito
            setSelectedProduct(null);
            setSelectedMayoristas({}); // Puedes ajustar esto según sea necesario
        }
    };    

    const handleVerCarrito = (event: SyntheticEvent) => {
        // Muestra la sección del carrito, por ejemplo, a través de un modal, un componente emergente, etc.
        console.log("Productos en el carrito:", carrito);
        setAnchorEl(event.currentTarget)
    };

    const handleDropdownClose = (url?: string) => {
        if (url) {
          router.push(url)
        }
        setAnchorEl(null)
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                <Typography variant='h5' sx={{ float: "left" }}>Productos</Typography>
                <Button
                    variant='contained'
                    onClick={handleVerCarrito}
                    sx={{ float: "right" }}
                >
                    Ver Carrito
                </Button>
            </Grid>
            
            {productos.map((producto) => (
                <Grid key={producto.id} item xs={12} sm={6} md={4}>
                    <Card>
                        <CardMedia 
                            sx={{   height: '9.375rem', backgroundColor: "#ffffff", backgroundSize: "contain",
                                    backgroundPosition: "center", backgroundRepeat: "no-repeat", borderBottom: "1px solid #ccc" }} 
                            image={`${producto.imagen}`} 
                        /> 
                        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
                            <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                {producto.nombre}
                            </Typography>
                            {producto.mayoristas?.map((mayorista) => (
                                <div key={mayorista.id_mayorista}>
                                    <Typography sx={{ marginBottom: 0 }}>
                                        <Radio
                                            value={mayorista.id_mayorista}
                                            checked={
                                                selectedProduct?.id === producto.id &&
                                                selectedMayoristas[producto.id] === mayorista.id_mayorista
                                            }
                                            onChange={() => handleProductChange(producto, mayorista)}
                                            sx={{padding:"0px"}}
                                        />
                                        ${producto.precio} ({mayorista.nombre_mayorista})
                                    </Typography>
                                </div>
                            ))}
                        </CardContent>
                        <Button
                            variant='contained'
                            sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                            onClick={handleAgregarAlCarrito}
                        >
                            Agregar al carrito
                        </Button>
                    </Card>
                </Grid>
            ))}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleDropdownClose()}
                sx={{ '& .MuiMenu-paper': { width: 430, marginTop: 1 } }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Grid
                    item
                    xs={12}
                    md={12}
                >
                <Card sx={{ padding: '0.5rem !important' }}>                    
                    <Box component='span' sx={{ fontWeight: 500, width: '50%', float: 'left' }}>
                        <Typography variant='body2' sx={{padding: 0 }} >
                            Producto
                        </Typography>
                    </Box>
                    <Box component='span' sx={{ fontWeight: 500, width: '25%', float: 'left' }}>
                        <Typography variant='body2' sx={{padding: 0 }}>
                            Cantidad
                        </Typography>
                    </Box>
                    <Box component='span' sx={{ fontWeight: 500, width: '25%', float: 'left' }}>
                        <Typography variant='body2' sx={{padding: 0 }}>
                            Precio
                        </Typography>
                    </Box>
                </Card>
                </Grid>
            {carrito.map((productoCarrito) => (
                <Grid
                    item
                    xs={12}
                    md={12}
                >
                <Card key={productoCarrito.id} sx={{ padding: '0.5rem !important' }}>                    
                    <Box component='span' sx={{ fontWeight: 500, width: '50%', float: 'left' }}>
                        <Typography sx={{ fontWeight: 500, marginBottom: 1, padding: 0 }} >
                            {productoCarrito.nombre} ({productoCarrito.nombre})
                        </Typography>
                    </Box>
                    <Box component='span' sx={{ fontWeight: 500, width: '25%', float: 'left' }}>
                        <Typography variant='body2' sx={{padding: 0 }}>
                            {productoCarrito.precio}
                        </Typography>
                    </Box>
                    <Box component='span' sx={{ fontWeight: 500, width: '25%', float: 'left' }}>
                        <Typography variant='body2' sx={{padding: 0 }}>
                            ${productoCarrito.precio}
                        </Typography>
                    </Box>
                </Card>
                </Grid>
            ))}
            </Menu>
        </Grid>
    )
}

export default CardBasic;
