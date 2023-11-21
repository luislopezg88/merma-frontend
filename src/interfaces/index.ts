import { Dayjs } from 'dayjs'

export interface IProducto {
    id?: string;
    nombre?: string;
    descripcion?: string;
    imagen?: string;
    precio?: number;
    mayoristas?: IMayorista[] | null;
}

export interface IMayorista {
    id_mayorista: string;
    nombre_mayorista: string;
    // Agrega otras propiedades según sea necesario
}

export interface IInventario {
    id?: string;
    id_producto?: string | null;
    fecha_vencimiento?: Dayjs | null;
    cantidad?: number;
}

export interface ILicitacion {
    id?: string;
    nombre: string;
    descripcion?: string;
    inicio: Dayjs | null;
    fin: Dayjs | null;
    presupuesto: string;
    id_user?: string;
}
