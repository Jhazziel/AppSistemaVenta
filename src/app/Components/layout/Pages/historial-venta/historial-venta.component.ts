import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Venta } from 'src/app/Interfaces/venta';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { VentaService } from 'src/app/Services/venta.service';
import { ModalDetalleVentaComponent } from '../../Modals/modal-detalle-venta/modal-detalle-venta.component';

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
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    { value: "fecha", descripcion: "Por fechas" },
    { value: "numero", descripcion: "Número venta" }
  ];
  columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  dataInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });

    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(
      value => {
        this.formularioBusqueda.patchValue({
          numero: "",
          fechaInicio: "",
          fechaFin: ""
        });
      }
    );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  AplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== "")
      this.datosListaVenta.filter = filterValue.trim().toLowerCase();
    else
      this.datosListaVenta.filter = '';
  }

  buscarVentas() {
    let _fechaInicio: string = "";
    let _fechaFin: string = "";

    if (this.formularioBusqueda.value.buscarPor === "fecha") {
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

      if (_fechaInicio === "invalid date" || _fechaFin === "invalid date") {
        this._utilidadService.MostrarAlerta("Debe ingresar ambas fechas", "Oops!");
        return;
      }
    }

    this._ventaService.Historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (data) => {
        if (data.status)
          this.datosListaVenta = data.value;

        else
          this._utilidadService.MostrarAlerta("No se encontraron datos", "Oops!");
      },
      error: (e) => { }
    });
  }

  verDetalleVenta(_venta: Venta) {
    this.dialog.open(ModalDetalleVentaComponent, {
      data: _venta,
      disableClose: true,
      width: '700px'
    });
  }
}
