import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BeneficiarioService } from '../core/services/beneficiario.service';
import { Beneficiario } from '../core/models/beneficiario';

@Component({
  selector: 'app-beneficiario',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatTableModule, MatPaginatorModule],
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.scss']
})
export class BeneficiarioComponent implements AfterViewInit {
  private readonly beneficiarioService = inject(BeneficiarioService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['nombre', 'documento', 'email', 'telefono', 'estado'];
  dataSource = new MatTableDataSource<Beneficiario>([]);
  loading = true;
  errorMessage = '';

  constructor() {
    this.beneficiarioService.listar().subscribe({
      next: (beneficiarios: Beneficiario[]) => {
        this.dataSource.data = beneficiarios;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los beneficiarios.';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
