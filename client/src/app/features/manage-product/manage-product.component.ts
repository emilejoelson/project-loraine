// src/app/manage-product/manage-product.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Client, Commande, LigneCMD, OrderStatus, Product } from './data-access/models/manage-product';
import { ProductManagementService } from './data-access/services/product-management.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-manage-product',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit {
  // Active tab management
  activeTab: 'products' | 'clients' | 'orders' = 'products';
  
  // Product management
  productForm: FormGroup;
  products: Product[] = [];
  editModeProduct = false;
  currentProductId: number | null = null;
  loadingProducts = false;
  searchTermProduct = '';
  filteredProducts: Product[] = [];

  // Client management
  clientForm: FormGroup;
  clients: Client[] = [];
  editModeClient = false;
  currentClientId: number | null = null;
  loadingClients = false;
  searchTermClient = '';
  filteredClients: Client[] = [];

  // Order management
  orderForm: FormGroup;
  orders: Commande[] = [];
  orderLines: FormArray;
  editModeOrder = false;
  currentOrderId: number | null = null;
  loadingOrders = false;
  searchTermOrder = '';
  filteredOrders: Commande[] = [];
  orderStatuses = Object.values(OrderStatus);
  selectedOrder: Commande | null = null;
  selectedOrderLines: LigneCMD[] = [];
  loadingOrderDetails = false;

  constructor(
    private fb: FormBuilder,
    private productManagementService: ProductManagementService,
    
  ) {
    // Initialize product form
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      inStock: [true]
    });

    // Initialize client form
    this.clientForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      active: [true]
    });

    // Initialize order form with order lines as FormArray
    this.orderLines = this.fb.array([]);
    this.orderForm = this.fb.group({
      clientId: [null, [Validators.required]],
      shippingAddress: ['', [Validators.required]],
      billingAddress: ['', [Validators.required]],
      paymentMethod: ['', [Validators.required]],
      paymentStatus: [false],
      status: [OrderStatus.PENDING, [Validators.required]],
      notes: [''],
      orderLines: this.orderLines
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadClients();
    this.loadOrders();
  }

  // Tab Navigation
  setActiveTab(tab: 'products' | 'clients' | 'orders'): void {
    this.activeTab = tab;
  }

  // =================================================
  // PRODUCT MANAGEMENT
  // =================================================
  loadProducts(): void {
    this.loadingProducts = true;
    this.productManagementService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        this.loadingProducts = false;
      },
      error: (error) => {
        console.error('Error fetching products', error);
        this.loadingProducts = false;
      }
    });
  }

  submitProductForm(): void {
    if (this.productForm.invalid) return;

    const product: Product = this.productForm.value;
    this.loadingProducts = true;

    if (this.editModeProduct && this.currentProductId !== null) {
      product.id = this.currentProductId;
      this.productManagementService.updateProduct(product).subscribe({
        next: () => {
          this.resetProductForm();
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error updating product', error);
          this.loadingProducts = false;
        }
      });
    } else {
      this.productManagementService.createProduct(product).subscribe({
        next: () => {
          this.resetProductForm();
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error creating product', error);
          this.loadingProducts = false;
        }
      });
    }
  }

  editProduct(product: Product): void {
    this.editModeProduct = true;
    this.currentProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      inStock: product.inStock
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.loadingProducts = true;
      this.productManagementService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product', error);
          this.loadingProducts = false;
        }
      });
    }
  }

  resetProductForm(): void {
    this.editModeProduct = false;
    this.currentProductId = null;
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      inStock: true
    });
  }

  searchProducts(): void {
    if (!this.searchTermProduct.trim()) {
      this.filteredProducts = [...this.products];
      return;
    }
    
    const term = this.searchTermProduct.toLowerCase();
    this.filteredProducts = this.products.filter(
      product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
  }

  // =================================================
  // CLIENT MANAGEMENT
  // =================================================
  loadClients(): void {
    this.loadingClients = true;
    this.productManagementService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = [...this.clients];
        this.loadingClients = false;
      },
      error: (error) => {
        console.error('Error fetching clients', error);
        this.loadingClients = false;
      }
    });
  }

  submitClientForm(): void {
    if (this.clientForm.invalid) return;

    const client: Client = this.clientForm.value;
    this.loadingClients = true;

    if (this.editModeClient && this.currentClientId !== null) {
      client.id = this.currentClientId;
      this.productManagementService.updateClient(client).subscribe({
        next: () => {
          this.resetClientForm();
          this.loadClients();
        },
        error: (error) => {
          console.error('Error updating client', error);
          this.loadingClients = false;
        }
      });
    } else {
      // Set registration date for new clients
      client.registrationDate = new Date();
      this.productManagementService.createClient(client).subscribe({
        next: () => {
          this.resetClientForm();
          this.loadClients();
        },
        error: (error) => {
          console.error('Error creating client', error);
          this.loadingClients = false;
        }
      });
    }
  }

  editClient(client: Client): void {
    this.editModeClient = true;
    this.currentClientId = client.id;
    this.clientForm.patchValue({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      postalCode: client.postalCode,
      country: client.country,
      active: client.active
    });
  }

  deleteClient(id: number): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.loadingClients = true;
      this.productManagementService.deleteClient(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error) => {
          console.error('Error deleting client', error);
          this.loadingClients = false;
        }
      });
    }
  }

  resetClientForm(): void {
    this.editModeClient = false;
    this.currentClientId = null;
    this.clientForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      active: true
    });
  }

  searchClients(): void {
    if (!this.searchTermClient.trim()) {
      this.filteredClients = [...this.clients];
      return;
    }
    
    const term = this.searchTermClient.toLowerCase();
    this.filteredClients = this.clients.filter(
      client => 
        client.firstName.toLowerCase().includes(term) || 
        client.lastName.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.phone.toLowerCase().includes(term)
    );
  }

  // =================================================
  // ORDER MANAGEMENT
  // =================================================
  loadOrders(): void {
    this.loadingOrders = true;
    this.productManagementService.getCommandes().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = [...this.orders];
        this.loadingOrders = false;
      },
      error: (error) => {
        console.error('Error fetching orders', error);
        this.loadingOrders = false;
      }
    });
  }

  submitOrderForm(): void {
    if (this.orderForm.invalid) return;

    const orderData = this.orderForm.value;
    const order: Commande = {
      id: this.currentOrderId || 0,
      clientId: orderData.clientId,
      orderDate: new Date(),
      totalAmount: this.calculateOrderTotal(),
      status: orderData.status,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      notes: orderData.notes
    };

    this.loadingOrders = true;

    if (this.editModeOrder && this.currentOrderId !== null) {
      this.productManagementService.updateCommande(order).subscribe({
        next: () => {
          this.saveOrderLines(this.currentOrderId!);
        },
        error: (error) => {
          console.error('Error updating order', error);
          this.loadingOrders = false;
        }
      });
    } else {
      this.productManagementService.createCommande(order).subscribe({
        next: (newOrder) => {
          this.saveOrderLines(newOrder.id);
        },
        error: (error) => {
          console.error('Error creating order', error);
          this.loadingOrders = false;
        }
      });
    }
  }

  saveOrderLines(orderId: number): void {
    // Get order lines from form
    const formLines = this.orderForm.get('orderLines') as FormArray;
    const orderLines: LigneCMD[] = formLines.controls.map((control, index) => {
      const line = control.value;
      return {
        id: line.id || 0,
        commandeId: orderId,
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        discount: line.discount,
        total: line.quantity * line.unitPrice * (1 - line.discount / 100)
      };
    });

    // If editing, first delete existing lines
    if (this.editModeOrder) {
      this.productManagementService.deleteLignesCMDByCommandeId(orderId).subscribe({
        next: () => {
          this.createNewOrderLines(orderLines);
        },
        error: (error) => {
          console.error('Error deleting order lines', error);
          this.loadingOrders = false;
        }
      });
    } else {
      this.createNewOrderLines(orderLines);
    }
  }

  createNewOrderLines(orderLines: LigneCMD[]): void {
    const saveObservables = orderLines.map(line => this.productManagementService.createLigneCMD(line));
    
    // If no lines, just complete the process
    if (saveObservables.length === 0) {
      this.resetOrderForm();
      this.loadOrders();
      return;
    }

    // Otherwise save all lines
    let savedCount = 0;
    saveObservables.forEach(obs => {
      obs.subscribe({
        next: () => {
          savedCount++;
          if (savedCount === saveObservables.length) {
            this.resetOrderForm();
            this.loadOrders();
          }
        },
        error: (error) => {
          console.error('Error saving order line', error);
          this.loadingOrders = false;
        }
      });
    });
  }

  addOrderLine(): void {
    const orderLine = this.fb.group({
      id: [null],
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
    
    this.orderLines.push(orderLine);
  }

  removeOrderLine(index: number): void {
    this.orderLines.removeAt(index);
  }

  getProductPrice(event: any, index: number): void {
    const productId = event.target.value;
    const product = this.products.find(p => p.id === Number(productId));
    
    if (product) {
      const orderLine = (this.orderLines.at(index) as FormGroup);
      orderLine.patchValue({ unitPrice: product.price });
    }
  }

  calculateOrderTotal(): number {
    let total = 0;
    const formLines = this.orderForm.get('orderLines') as FormArray;
    
    formLines.controls.forEach(control => {
      const line = control.value;
      const lineTotal = line.quantity * line.unitPrice * (1 - line.discount / 100);
      total += lineTotal;
    });
    
    return total;
  }

  viewOrderDetails(order: Commande): void {
    this.selectedOrder = order;
    this.loadingOrderDetails = true;
    
    this.productManagementService.getLignesCMDByCommandeId(order.id).subscribe({
      next: (lines) => {
        this.selectedOrderLines = lines;
        this.loadingOrderDetails = false;
      },
      error: (error) => {
        console.error('Error fetching order lines', error);
        this.loadingOrderDetails = false;
      }
    });
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.selectedOrderLines = [];
  }

  editOrder(order: Commande): void {
    this.editModeOrder = true;
    this.currentOrderId = order.id;
    
    // Clear existing order lines
    while (this.orderLines.length) {
      this.orderLines.removeAt(0);
    }
    
    // Populate form with order data
    this.orderForm.patchValue({
      clientId: order.clientId,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      notes: order.notes
    });
    
    // Load order lines
    this.productManagementService.getLignesCMDByCommandeId(order.id).subscribe({
      next: (lines) => {
        lines.forEach(line => {
          const lineForm = this.fb.group({
            id: [line.id],
            productId: [line.productId, Validators.required],
            quantity: [line.quantity, [Validators.required, Validators.min(1)]],
            unitPrice: [line.unitPrice, [Validators.required, Validators.min(0)]],
            discount: [line.discount, [Validators.required, Validators.min(0), Validators.max(100)]]
          });
          this.orderLines.push(lineForm);
        });
      },
      error: (error) => {
        console.error('Error fetching order lines for editing', error);
      }
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.loadingOrders = true;
      
      // First delete order lines
      this.productManagementService.deleteLignesCMDByCommandeId(id).subscribe({
        next: () => {
          // Then delete the order
          this.productManagementService.deleteCommande(id).subscribe({
            next: () => {
              this.loadOrders();
            },
            error: (error) => {
              console.error('Error deleting order', error);
              this.loadingOrders = false;
            }
          });
        },
        error: (error) => {
          console.error('Error deleting order lines', error);
          this.loadingOrders = false;
        }
      });
    }
  }

  resetOrderForm(): void {
    this.editModeOrder = false;
    this.currentOrderId = null;
    
    // Clear order lines
    while (this.orderLines.length) {
      this.orderLines.removeAt(0);
    }
    
    this.orderForm.reset({
      clientId: null,
      shippingAddress: '',
      billingAddress: '',
      paymentMethod: '',
      paymentStatus: false,
      status: OrderStatus.PENDING,
      notes: ''
    });
    
    // Add one empty order line by default
    this.addOrderLine();
  }

  searchOrders(): void {
    if (!this.searchTermOrder.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }
    
    const term = this.searchTermOrder.toLowerCase();
    this.filteredOrders = this.orders.filter(order => {
      const client = this.clients.find(c => c.id === order.clientId);
      const clientName = client ? `${client.firstName} ${client.lastName}`.toLowerCase() : '';
      
      return clientName.includes(term) || 
        order.status.toLowerCase().includes(term) ||
        order.paymentMethod.toLowerCase().includes(term);
    });
  }

  getClientName(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  }

  getOrderStatusClass(status: string): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-200 text-yellow-800';
      case OrderStatus.PROCESSING:
        return 'bg-blue-200 text-blue-800';
      case OrderStatus.SHIPPED:
        return 'bg-purple-200 text-purple-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-200 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }
  
  calculateLineTotal(line: LigneCMD): number {
    return line.quantity * line.unitPrice * (1 - line.discount / 100);
  }
}