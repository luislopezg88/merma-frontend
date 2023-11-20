import { Dayjs } from 'dayjs'

export interface IProducto {
    id?: string;
    nombre?: string;
    descripcion?: string;
    imagen?: string;
    precio?: number;
}

export interface IInventario {
    id?: string;
    nombre?: string;
    fecha_vencimiento?: Date | undefined;
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