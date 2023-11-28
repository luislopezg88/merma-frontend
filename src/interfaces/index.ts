import { Dayjs } from 'dayjs'

export interface IProducto {
    id: string;
    nombre?: string;
    descripcion?: string;
    imagen?: string;
    precio?: number;
    cantidad?: number;
    mayoristas?: IMayorista[] | null;
    precio_descuento?: number;
}

export interface IMayorista {
    id_mayorista: string | null;
    nombre_mayorista: string;
    descripcion: string;
    telefono: string;
    ubicacion: string;
    id_user: string;
    fecha_vencimiento? : Date | null;
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
