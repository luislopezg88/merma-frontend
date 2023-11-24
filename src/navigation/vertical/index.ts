// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import ListStatus from 'mdi-material-ui/ViewList'
import { useAuth } from '../../context/AuthProvider';

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  const auth = useAuth();
  const userRole = auth.getUser()?.rol;

  const commonOptions = [
    {
      title: 'Inicio',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Cuenta',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
  ];

  if (userRole === 'mayorista') {
    return [
      ...commonOptions,
      {
        title: 'Tienda',
        icon: CreditCardOutline,
        path: '/tienda'
      },
      {
        title: 'Productos',
        icon: ListStatus,
        path: '/productos'
      },
      {
        title: 'Inventario',
        icon: Table,
        path: '/inventario'
      },
      // Puedes agregar más opciones específicas para mayoristas aquí
    ];
  } else if (userRole === 'cliente') {
    return [
      ...commonOptions,
      {
        title: 'Tienda',
        icon: CreditCardOutline,
        path: '/tienda'
      },
      // Puedes agregar más opciones específicas para clientes aquí
    ];
  }

  // Puedes agregar más lógica para otros roles si es necesario

  return commonOptions;
}

export default navigation
