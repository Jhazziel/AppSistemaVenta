import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {
  
  formularioProducto: FormGroup;
  tituloAccion: string = "Agregar";
  botonAction: string = "Guardar";
  listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _categoriaService: CategoriaService,
    private _productoService: ProductoService,
    private _utilidadService: UtilidadService
  ) { 
    this.formularioProducto = fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });

    if (this.datosProducto != null) {
      this.tituloAccion = "Editar";
      this.botonAction = "Actualizar"
    }

    this._categoriaService.Lista().subscribe({
      next: (data) => {
        if (data.status)
          this.listaCategorias = data.value;
      },
      error: (e) => { }
    });
  }

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precioText,
        esActivo: this.datosProducto.esActivo.toString()
      });
    }
  }

  GuardarEditar_Producto() {
    const _producto: Producto = {
      idProducto: this.datosProducto == null ? 0: this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      categoriaDescription: "",
      precioText: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo)
    }

    if (this.datosProducto == null) {
      this._productoService.Guardar(_producto).subscribe({
        next: (data) => {
          if (data.status){
            this._utilidadService.MostrarAlerta("Producto creado exitosamente", "Yeah!");
          
            this.modalActual.close("true");
          } else {
            this._utilidadService.MostrarAlerta("No se pudo crear el producto", "Opps!");
          }
      },
      error: (e) => { }
      });
    } else {
      this._productoService.Editar(_producto).subscribe({
        next: (data) => {
          if (data.status){
            this._utilidadService.MostrarAlerta("Producto actualizado exitosamente", "Yeah!");
          
            this.modalActual.close("true");
          } else {
            this._utilidadService.MostrarAlerta("No se pudo editar el producto", "Opps!");
          }
        }
      });
    }
  }
}
