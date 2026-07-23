import { Component } from '@angular/core';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { StatusChipRenderer } from './cell-renderers/statuschiprenderer.component';

@Component({
  selector: 'app-admin',
  imports: [AgGridAngular],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
colDefs: ColDef[] = [
        { field: "ID" },
        { field: "Name" },
        { field: "Description" },
        { field: "Price" },
        { field: "Status", filter: true, cellRenderer: StatusChipRenderer }

    ];
    rowData = [
        {ID: 1, Name: "Product 1", Description: "Description 1", Price: 10.99, Status: "Available"},
        {ID: 2, Name: "Product 2", Description: "Description 2", Price: 19.99, Status: "Out of Stock"},
        {ID: 3, Name: "Product 3", Description: "Description 3", Price: 5.99, Status: "Available"},
        {ID: 4, Name: "Product 4", Description: "Description 4", Price: 15.49, Status: "Discontinued"},
        {ID: 5, Name: "Product 5", Description: "Description 5", Price: 8.99, Status: "Available"}
    ];
   
    
}
