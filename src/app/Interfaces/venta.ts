import { DetalleVenta } from "./detalle-venta";

export interface Venta {
  idventa?: number,
  numeroDocumento?: string,
  tipoPago: string,
  fechaRegistro?: string,
  totalText: string,
  DetalleVenta: DetalleVenta[]
}
