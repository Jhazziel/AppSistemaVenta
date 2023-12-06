import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Usuario } from 'src/app/Interfaces/usuario';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { ModalUsuarioComponent } from '../../Modals/modal-usuario/modal-usuario.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTable: string[] = ['nombreCompleto', 'correo', 'rolDescription', 'estado', 'acciones'];
  dataInicio: Usuario[] = [];
  dataListaUsuario = new MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuarioService: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) { }

  ObtenerUsuarios() {
    this._usuarioService.Lista().subscribe({
      next: (data) => {
        if (data.status)
          this.dataListaUsuario.data = data.value;
        else
          this._utilidadServicio.MostrarAlerta("No se encontraron usuarios", "Oops!")
      },
      error: (e) => { }
    })
  }

  ngOnInit(): void {
    this.ObtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuario.paginator = this.paginacionTabla;
  }

  AplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== "")
      this.dataListaUsuario.filter = filterValue.trim().toLowerCase();
    else
      this.dataListaUsuario.filter = '';
  }

  NuevoUsuario() {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.ObtenerUsuarios();
      }
    });
  }

  EditarUsuario(usuario:Usuario) {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.ObtenerUsuarios();
      }
    });
  }

  EliminarUsuario(usuario:Usuario) {
    Swal.fire({
      title: "¿Desea eliminar el usuario?",
      text: usuario.nombreCompleto,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, volver"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._usuarioService.Eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.MostrarAlerta("El usuario fue eliminado", "Yeah!");
              this.ObtenerUsuarios();
            } else {
              this._utilidadServicio.MostrarAlerta("No se pudo eliminar el usuario", "Oops!");
            }
          },
          error: (e) => { }
        });
      }
    });
  }

}
