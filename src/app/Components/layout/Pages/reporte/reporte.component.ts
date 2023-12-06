import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Reporte } from 'src/app/Interfaces/reporte';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { VentaService } from 'src/app/Services/venta.service';

import * as XLSX from "xlsx";

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    {provide:MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
  ]
})
export class ReporteComponent implements OnInit {

  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = ['fechaRegistro', 'numeroVenta', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;


  constructor(
    private fb: FormBuilder,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ) { 
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas() {

    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');

    if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
      this._utilidadService.MostrarAlerta("Debe ingrear ambas fechas", "Oops!");
      return
    }

    this._ventaService.Resumen(_fechaInicio, _fechaFin).subscribe({
      next:(data) => {
        if (data.status) {
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        } else {
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadService.MostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => { }
    });
  }

  exportarExcel() {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);

      XLSX.utils.book_append_sheet(wb, ws, "Reporte");
      XLSX.writeFile(wb, "Reporte Ventas.xlsx");
  }
}
