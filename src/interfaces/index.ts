import { Dayjs } from 'dayjs'

export interface IEmpresa {
    id?: string;
    nombre?: string;
    descripcion?: string;
    tipo?: string;
    empleados: string;
    finalidad?: string;
    instrumento?: string;
    administracion?: string;
    organo?: string;
    tags: Array<string>;
    id_user?: string;
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