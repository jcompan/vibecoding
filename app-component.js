// app.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface HistorialItem {
  concepto: string;
  tipoDetectado: string;
  tipoCorregido?: string;
}

@Component({
  selector: 'app-tipificador',
  templateUrl: './tipificador.component.html',
  styleUrls: ['./tipificador.component.css']
})
export class TipificadorComponent {
  // Variables
  concepto = '';
  tipoIngreso: string | null = null;
  editandoTipo = false;
  tipoCorregido = '';
  historial: HistorialItem[] = [];
  cargando = false;
  
  // URL del API REST (a modificar según tu entorno)
  private apiUrl = 'https://api.example.com/tipificador';
  
  constructor(private http: HttpClient) {}
  
  // Función para verificar el tipo de ingreso
  verificarTipo(): void {
    if (!this.concepto) return;
    
    // Mostrar indicador de carga
    this.cargando = true;
    
    // Llamada al API REST
    this.http.post<{tipo: string}>(this.apiUrl + '/verificar', {
      concepto: this.concepto
    }).subscribe({
      next: (response) => {
        // Éxito en la llamada
        this.tipoIngreso = response.tipo;
        this.cargando = false;
        
        // Agregar al historial
        this.historial.unshift({
          concepto: this.concepto,
          tipoDetectado: this.tipoIngreso,
          tipoCorregido: undefined
        });
      },
      error: (error) => {
        // Error en la llamada
        console.error('Error al verificar el tipo:', error);
        this.cargando = false;
        alert('Ocurrió un error al conectar con el servicio. Por favor, inténtalo de nuevo.');
      }
    });
  }
  
  // Habilitar edición del tipo
  habilitarEdicion(): void {
    this.editandoTipo = true;
    this.tipoCorregido = this.tipoIngreso || '';
  }
  
  // Cancelar edición
  cancelarEdicion(): void {
    this.editandoTipo = false;
    this.tipoCorregido = '';
  }
  
  // Corregir tipo de ingreso
  corregirTipo(): void {
    if (!this.tipoCorregido) return;
    
    this.http.post<{success: boolean}>(this.apiUrl + '/corregir', {
      concepto: this.concepto,
      tipoOriginal: this.tipoIngreso,
      tipoCorregido: this.tipoCorregido
    }).subscribe({
      next: (response) => {
        if (response.success) {
          // Actualizar tipo y estado
          this.tipoIngreso = this.tipoCorregido;
          this.editandoTipo = false;
          
          // Actualizar historial
          if (this.historial.length > 0) {
            this.historial[0].tipoCorregido = this.tipoCorregido;
          }
          
          // Mostrar mensaje de éxito
          alert('¡Tipo de ingreso corregido correctamente!');
        }
      },
      error: (error) => {
        console.error('Error al corregir el tipo:', error);
        alert('Ocurrió un error al corregir el tipo. Por favor, inténtalo de nuevo.');
      }
    });
  }
  
  // Limpiar formulario
  limpiarFormulario(): void {
    this.concepto = '';
    this.tipoIngreso = null;
    this.editandoTipo = false;
    this.tipoCorregido = '';
  }
}
