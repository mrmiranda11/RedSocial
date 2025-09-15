export interface User {
    id: number;
    email: string;
    primer_nombre: string;
    segundo_nombre?: string | null;
    primer_apellido: string;
    segundo_apellido?: string | null;
    usuario?: string  | null;
    password: string;
    fecha_nacimiento: string;
    estado: string;
    ultimo_login_at?: Date;
    creado_at?: Date;
    actualizado_at?: Date;
  }


  








