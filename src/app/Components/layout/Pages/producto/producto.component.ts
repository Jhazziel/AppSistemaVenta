import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ModalProductoComponent } from '../..//Modals/modal-producto/modal-producto.component';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit {

  columnasTable: string[] = ['nombre', 'categoria', 'stock', 'precio', 'estado', 'acciones'];
  dataInicio: Producto[] = [];
  dataListaProductos = new MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _productoService: ProductoService,
    private _utilidadServicio: UtilidadService
  ) { }

  ObtenerProductos() {
    this._productoService.Lista().subscribe({
      next: (data) => {
        if (data.status)
          this.dataListaProductos.data = data.value;
        else
          this._utilidadServicio.MostrarAlerta("No se encontraron productos", "Oops!")
      },
      error: (e) => { }
    })
  }

  ngOnInit(): void {
    this.ObtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  AplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== "")
      this.dataListaProductos.filter = filterValue.trim().toLowerCase();
    else
      this.dataListaProductos.filter = '';
  }
  
  NuevoProducto() {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.ObtenerProductos();
      }
    });
  }

  EditarProducto(producto:Producto) {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: producto
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.ObtenerProductos();
      }
    });
  }

  EliminarProducto(producto:Producto) {
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      text: producto.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, volver"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._productoService.Eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.MostrarAlerta("El producto fue eliminado", "Yeah!");
              this.ObtenerProductos();
            } else {
              this._utilidadServicio.MostrarAlerta("No se pudo eliminar el producto", "Oops!");
            }
          },
          error: (e) => { }
        });
      }
    });
  }
}
