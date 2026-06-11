export interface Beneficiario {
  id: number;
  nombre: string;
  documento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  estado?: string;
}
