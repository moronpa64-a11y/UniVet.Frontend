export interface HistoriaClinica {
  id?: number;
  usuario: string;
  mascota: string;
  raza: string;
  especie: string;
  fecha: string;
  padecimiento: string;
  medicamento: string;
  dosis: string;
  miligramos: number;
  enRevision: boolean;
  proximoControl: string | null;
  dadoDeAlta: boolean;
  observaciones: string;
}
