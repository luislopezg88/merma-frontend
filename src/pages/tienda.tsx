// ** MUI Imports
import React, { useState, SyntheticEvent, useEffect } from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { IProducto, IMayorista } from 'src/interfaces' // Ajusta según tu interfaz real
import { useAuth } from 'src/context/AuthProvider'
import { API_URL } from 'src/configs/constans'
import Delete from 'mdi-material-ui/Delete'
import PlusCircle from 'mdi-material-ui/PlusCircle'
import MinusCircle from 'mdi-material-ui/MinusCircle'

// ** Demo Components Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import { Alert, Box, IconButton, Menu, Radio } from '@mui/material';
import { IMG_URL } from 'src/configs/constans';
import { AuthResponse, AuthResponseError, IResponseError } from 'src/configs/types'
import { AlertColor } from '@mui/material'

interface IMessage  {
  show: boolean;
  text: string;
  type: AlertColor
}

const CardBasic = () => {
    const [productos, setProductos] = useState<IProducto[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<IProducto | null>(null);
    const [selectedMayoristas, setSelectedMayoristas] = useState<{ [key: string]: string | null }>({});
    const [carrito, setCarrito] = useState<IProducto[]>([]);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)
    const [message, setMessage] = useState<IMessage>({
        show: false,
        text: '',
        type: 'success'
      })
    const auth = useAuth();
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
          const mayoristaId = selectedMayoristas[selectedProduct.id];
          const mayorista = selectedProduct.mayoristas?.find(m => m.id_mayorista === mayoristaId);
          const productoConMayorista = {
            ...selectedProduct,
            mayoristas: mayorista ? [mayorista] : [],
            cantidad: 1, // Cantidad predeterminada
          };

          console.log(productoConMayorista);
      
          // Calcula el descuento y aplica al precio
          const fechaVencimiento = mayorista?.fecha_vencimiento ? new Date(mayorista.fecha_vencimiento) : undefined;
            const descuento = calcularDescuento(fechaVencimiento);

          const precioConDescuento = (productoConMayorista?.precio ?? 0) * (1 - descuento);
          console.log(mayorista?.fecha_vencimiento);
          console.log(productoConMayorista?.precio);
          console.log(descuento);
      
          // Agrega el producto con ambos precios al carrito
          setCarrito(prevCarrito => [
            ...prevCarrito,
            {
              ...productoConMayorista,
              precio_descuento: precioConDescuento,
            },
          ]);

            setTimeout(() => {
              setMessage({
                show: true,
                text: 'Producto agregado correctamente',
                type: 'success'
              })
            }, 1000);
      
          // Limpiar la selección actual después de agregar al carrito
          setSelectedProduct(null);
          setSelectedMayoristas({});

          // Oculta el mensaje después de 2 segundos
          setTimeout(() => {
            setMessage({
                ...message,
                show: false,
            });
        }, 2000);
        }
    };      

    const handleVerCarrito = (event: SyntheticEvent) => {
        // Muestra la sección del carrito, por ejemplo, a través de un modal, un componente emergente, etc.
        console.log("Productos en el carrito:", carrito);
        setAnchorEl(event.currentTarget)
    };

    const handleIncrementarCantidad = (productoId: string) => {
        setCarrito(prevCarrito =>
          prevCarrito.map(producto => {
            if (producto.id === productoId.toString() && producto.cantidad !== undefined) {
              return { ...producto, cantidad: producto.cantidad + 1 };
            }
            return producto;
          })
        );
    };
    
    const handleDecrementarCantidad = (productoId: string) => {
        setCarrito(prevCarrito =>
          prevCarrito.map(producto => {
            if (producto.id === productoId.toString() && producto.cantidad !== undefined && producto.cantidad > 1) {
              return { ...producto, cantidad: producto.cantidad - 1 };
            }
            return producto;
          })
        );
    };
    
    const handleEliminarProducto = (productoId: string) => {
        setCarrito(prevCarrito =>
            prevCarrito.filter(producto => producto.id !== productoId.toString())
        );
    };

    const handleDropdownClose = (url?: string) => {
        if (url) {
          router.push(url)
        }
        setAnchorEl(null)
    }

    const handleGuardarCarrito = async () => {
        try {
            const user = auth.getUser();
            const id_cliente = user?.id;
            // Obtener los datos necesarios del carrito
            const datosCarrito = carrito.map(item => {
                const { id, mayoristas, precio, precio_descuento, cantidad } = item;
                const { id_mayorista, fecha_vencimiento } = mayoristas?.[0] || { id_mayorista: '', fecha_vencimiento: null }; // Usar optional chaining y proporcionar un objeto vacío por defecto
            
                //console.log('fecha_vencimiento: ' + fecha_vencimiento);
            
                return {
                id,
                id_cliente,
                id_mayorista,
                fecha_vencimiento,
                precio,
                precio_descuento,
                cantidad
                };
            });
  
            // Enviar los datos a la API
            const response = await fetch(`${API_URL}/carrito`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosCarrito),
            });
      
          if (response.ok) {
            // Los datos se guardaron exitosamente en la base de datos
            console.log('Los datos del carrito se guardaron correctamente.');
            setTimeout(() => {
                setMessage({
                  show: true,
                  text: 'Proceso realizado exitosamente',
                  type: 'success'
                })
              }, 1000);

            // Vacía el carrito después de guardar
            setCarrito([]);

            // Oculta el mensaje después de 2 segundos
            setTimeout(() => {
                setMessage({
                    ...message,
                    show: false,
                });
            }, 2000);

            // Cierra la sección del carrito (menú)
            handleDropdownClose();
          } else {
            // Ocurrió un error al guardar los datos en la base de datos
            console.error('Error al guardar los datos del carrito.');
          }
        } catch (error) {
          // Ocurrió un error en la solicitud
          console.error('Error en la solicitud:', error);
        }
    };

    const total = carrito.reduce((accumulator, productoCarrito) => {
        const subtotal = (productoCarrito.precio_descuento ?? 0) * (productoCarrito.cantidad ?? 0);
        return accumulator + subtotal;
    }, 0);

    const calcularDescuento = (fechaVencimiento?: Date | null): number => {
        const hoy = new Date();

        if (!fechaVencimiento || !(fechaVencimiento instanceof Date)) {
            console.log('Fecha de vencimiento no válida:', fechaVencimiento);
            return 0; // Sin descuento si la fecha de vencimiento es null, undefined o no es un objeto Date
        }

        const diasRestantes = Math.floor((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        console.log('Días restantes:', diasRestantes);

        if (diasRestantes <= 5) {
            return 0.7; // 70% de descuento
        } else if (diasRestantes <= 15) {
            return 0.5; // 50% de descuento
        } else if (diasRestantes <= 30) {
            return 0.3; // 30% de descuento
        } else if (diasRestantes <= 60) {
            return 0.1; // 10% de descuento
        } else {
            return 0; // Sin descuento
        }
    };
     

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
            
            {productos.map((producto) => (
                <Grid key={producto.id} item xs={12} sm={6} md={4}>
                    <Card>
                        <CardMedia 
                            sx={{   height: '9.375rem', backgroundColor: "#ffffff", backgroundSize: "contain",
                                    backgroundPosition: "center", backgroundRepeat: "no-repeat", borderBottom: "1px solid #ccc" }} 
                            image={`${IMG_URL}/${producto.imagen}`} 
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
                                            sx={{ padding: "0px" }}
                                        />
                                        {producto.precio !== undefined && (
                                            <span style={{ fontWeight: "bold" }}>
                                                ${(producto.precio * (1 - calcularDescuento(mayorista?.fecha_vencimiento ? new Date(mayorista.fecha_vencimiento) : undefined))).toFixed(2)}
                                            </span>
                                        )}
                                        <span style={{ textDecoration: "line-through", paddingLeft: '20px' }}>
                                            {producto.precio !== undefined ? `$${producto.precio}` : 'Precio no disponible'}
                                        </span>
                                        {' '}
                                        <span>
                                            ({mayorista.nombre_mayorista})
                                        </span>
                                        <br />
                                        <span style={{ color: "red" }}>
                                            Descuento: {calcularDescuento(mayorista?.fecha_vencimiento ? new Date(mayorista.fecha_vencimiento) : undefined) * 100}%
                                        </span>
                                        <br />
                                        
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
                    <Box component='span' sx={{ fontWeight: 500, width: '55%', float: 'left' }}>
                        <Typography variant='body2' sx={{padding: 0 }} >
                            Producto
                        </Typography>
                    </Box>

                    <Box component='span' sx={{ fontWeight: 500, width: '30%', float: 'left' }}>
                        <Typography variant='body2' sx={{padding: 0 }}>
                            Cantidad
                        </Typography>
                    </Box>

                    <Box component='span' sx={{ fontWeight: 500, width: '15%', float: 'left', textAlign: 'right' }}>
                        <Typography variant='body2' sx={{padding: 0 }}>
                            Precio
                        </Typography>
                    </Box>
                </Card>
                </Grid>
                {carrito.map(productoCarrito => (
                <Grid item xs={12} md={12} key={productoCarrito.id}>
                    <Card key={productoCarrito.id} sx={{ padding: '0.5rem !important' }}>
                        <Box component='span' sx={{ fontWeight: 500, width: '55%', float: 'left' }}>
                            <Typography sx={{ fontWeight: 500, marginBottom: 1, padding: 0 }}>
                                {productoCarrito.nombre} ({productoCarrito.mayoristas && productoCarrito.mayoristas.length > 0 ? productoCarrito.mayoristas[0].nombre_mayorista : 'Sin mayorista'})
                            </Typography>
                        </Box>

                        <Box component='span' sx={{ width: '30%', float: 'left', textAlign: 'left' }}>
                            <IconButton sx={{ padding: '2px', paddingTop: '0px' }} onClick={() => handleDecrementarCantidad(productoCarrito.id)} disabled={productoCarrito.cantidad === 1}>
                                <MinusCircle />
                            </IconButton>
                            <Typography component='span' sx={{ margin: '0' }}>
                                {productoCarrito.cantidad}
                            </Typography>
                            <IconButton sx={{ padding: '2px', paddingTop: '0px' }} onClick={() => handleIncrementarCantidad(productoCarrito.id)}>
                                <PlusCircle />
                            </IconButton>
                            <IconButton sx={{ padding: '2px', paddingTop: '0px' }} onClick={() => handleEliminarProducto(productoCarrito.id)}>
                                <Delete sx={{ color: "#ff3e1d" }} />
                            </IconButton>
                        </Box>

                        <Box component='span' sx={{ fontWeight: 500, width: '15%', float: 'left', textAlign: 'right' }}>
                            <Typography variant='body2' sx={{padding: 0 }}>
                                {/* {productoCarrito.precio}*/}
                                ${(productoCarrito.precio_descuento ?? 0) * (productoCarrito.cantidad ?? 0)}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                ))}
                <Grid item xs={12} md={12} sx={{ textAlign: "right" }}>
                    <Card sx={{ padding: '0.5rem !important' }}>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Total: ${total}
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
                    <Button
                        variant='contained'
                        onClick={handleGuardarCarrito}
                        sx={{ marginBottom: "15px" }}
                    >
                        Guardar
                    </Button>
                </Grid>
            </Menu>
        </Grid>
    )
}

export default CardBasic;
