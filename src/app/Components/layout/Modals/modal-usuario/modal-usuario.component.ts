import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = "Agregar";
  botonAction: string = "Guardar";
  listaRoles: Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolService: RolService,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) { 
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ["", Validators.required],
      email: ["", Validators.required],
      idRol: ["", Validators.required],
      password: ["", Validators.required],
      esActivo: ["1", Validators.required]
    });

    if (this.datosUsuario != null) {
      this.tituloAccion = "Editar";
      this.botonAction = "Actualizar"
    }

    this._rolService.Lista().subscribe({
      next: (data) => {
        if (data.status)
          this.listaRoles = data.value;
      },
      error: (e) => { }
    });
  }

  ngOnInit(): void {
    if (this.datosUsuario != null) {
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        email: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        password: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      });
    }
  }

  GuardarEditar_usuario() {
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0: this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.email,
      idRol: this.formularioUsuario.value.idRol,
      rolDescription: "",
      clave: this.formularioUsuario.value.password,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }

    if (this.datosUsuario == null) {
      this._usuarioService.Guardar(_usuario).subscribe({
        next: (data) => {
          if (data.status){
            this._utilidadService.MostrarAlerta("Usuario creado exitosamente", "Yeah!");
          
            this.modalActual.close("true");
          } else {
            this._utilidadService.MostrarAlerta("No se pudo crear el usuario", "Opps!");
          }
      },
      error: (e) => { }
      });
    } else {
      this._usuarioService.Editar(_usuario).subscribe({
        next: (data) => {
          if (data.status){
            this._utilidadService.MostrarAlerta("Usuario actualizado exitosamente", "Yeah!");
          
            this.modalActual.close("true");
          } else {
            this._utilidadService.MostrarAlerta("No se pudo editar el usuario", "Opps!");
          }
        }
      });
    }
  }
}
