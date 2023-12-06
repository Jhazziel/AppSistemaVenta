import { Component, OnInit } from '@angular/core';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit {

  fechaRegistro: string = "";
  numeroDocumento: string = "";
  tipoPago: string = "";
  total: string = "";
  detalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = [];


  constructor() { }

  ngOnInit(): void {
  }

}
