import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/Cliente.interface';
import { ClienteService } from 'src/app/service/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[];
  clienteForm: FormGroup;
  accion: string = 'Agregar';

  @ViewChild('btnCerrar') btnCerrar: ElementRef;
  @ViewChild('btnAbrir') btnAbrir: ElementRef;

  id: number | undefined;

  constructor(
    private fb: FormBuilder,
    private _clienteService: ClienteService,
    private tostr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getClientes();
    this.formulario();
  }

  private formulario() {
    this.clienteForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  getClientes() {
    this._clienteService.getClientes().subscribe(
      (data) => {
        // console.log(data);
        this.clientes = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  guardarCliente() {
    let cliente: Cliente;
    cliente = this.clienteForm.value;

    if (this.id == undefined) {
      cliente.name = cliente.name[0].toUpperCase() + cliente.name.slice(1);
      cliente.lastName =
        cliente.lastName[0].toUpperCase() + cliente.lastName.slice(1);

      this._clienteService.saveCliente(cliente).subscribe(
        (data) => {
          this.btnCerrar.nativeElement.click();
          this.tostr.success(
            'Cliente Agragado Corectamente',
            'Cliente Agregado'
          );
          this.clienteForm.reset();
          this.getClientes();
        },
        (error) => {
          console.log(error);
          this.tostr.error(
            'Ha ocurrido un error al Guardar el Cliente..',
            'Error al Guardar Cliente'
          );
        }
      );
    } else {
      this._clienteService.updareClient(this.id, cliente).subscribe(
        (data) => {
          this.btnCerrar.nativeElement.click();
          this.clienteForm.reset();
          this.accion = 'Agragar';
          this.id = undefined;
          this.tostr.info(
            'El Cliente ha sido Actualizado Correctamente',
            'Cliente Actualizado'
          );
          this.getClientes();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  editCliente(cliente: Cliente) {
    this.accion = 'Editar';
    this.btnAbrir.nativeElement.click();
    this.id = cliente.id;

    this.clienteForm.patchValue(cliente);
  }

  deleteCliente(id: number) {
    if (confirm('Desea eliminar Este Cliente?')) {
      this._clienteService.deleteCliente(id).subscribe(
        (data) => {
          this.tostr.error('La tarjeta ha sido Eliminada', 'Tarjeta Eliminada');
          this.getClientes();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
