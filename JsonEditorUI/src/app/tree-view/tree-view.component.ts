import { Component, Output, EventEmitter } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { IntegrationService } from '../services/integration.service';
import { TransferService } from '../services/transfer.service';

interface ParentNode {
  name: string;
  attribute: string;
  children?: ParentNode[];
  id?: number;
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  attribute: string;
}

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
})
export class TreeViewComponent {
  @Output() jsonDataEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedIdEmit: EventEmitter<any> = new EventEmitter<any>();
  message: string = '';
  jsonData: any = undefined;
  selectedId: any = undefined;

  private transformer = (node: ParentNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      attribute: node.attribute
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  TREE_DATA: ParentNode[] = [];

  constructor(private apiData: IntegrationService, private transferData: TransferService) {}

  ngOnInit() {
    this.apiData.getList().subscribe((response) => {
      const root: ParentNode = {
        name: 'Asset Name',
        attribute: 'Root',
        children: [],
      };
      response.forEach((data: any) => {
        let childrenData = data.children;
        root.children?.push({
          name: data.name,
          attribute: data.attribute,
          children: this.processChildren(childrenData),
        });
      });
      this.TREE_DATA = [root];
      this.dataSource.data = this.TREE_DATA;
      this.treeControl.expand(this.treeControl.dataNodes[0]);
    });
  }

  processChildren(childrenData: any[]): ParentNode[] {
    return childrenData.map((child) => {
      return {
        name: child.name,
        attribute: child.attribute,
        children: child.children ? this.processChildren(child.children) : [],
      };
    });
  }

  nodeClicked(node: any): void {
    if (this.isObject(node.name) && node.name.id) {  
      this.selectedId = node.name.id;
      this.jsonApiCall();
      this.transferData.setId(this.selectedId);
    }
  }

  async jsonApiCall() {
    this.apiData.getJson(this.selectedId).subscribe(response => {
      this.jsonData = response.data;
      this.transferData.setMessage(this.jsonData);
    });
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  isObject(value: any): boolean {
    return value && typeof value === 'object';
  }
}
