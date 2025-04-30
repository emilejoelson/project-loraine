import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, Commande, LigneCMD, Product } from '../models/manage-product';
import { environment } from '../../../../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {
  private baseUrl = environment.apiUrl;
  private productsUrl = `${this.baseUrl}/products`;
  private clientsUrl = `${this.baseUrl}/clients`;
  private commandesUrl = `${this.baseUrl}/commandes`;
  private lignesCMDUrl = `${this.baseUrl}/lignesCMD`;

  constructor(private http: HttpClient) { }

  // Product methods
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, product);
  }

  updateProduct(product: Product): Observable<any> {
    return this.http.put<any>(`${this.productsUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.productsUrl}/${id}`);
  }

  // Client methods
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.clientsUrl);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.clientsUrl}/${id}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.clientsUrl, client);
  }

  updateClient(client: Client): Observable<any> {
    return this.http.put<any>(`${this.clientsUrl}/${client.id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.clientsUrl}/${id}`);
  }

  // Commande methods
  getCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.commandesUrl);
  }

  getCommandeById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.commandesUrl}/${id}`);
  }

  getCommandesByClientId(clientId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.commandesUrl}/client/${clientId}`);
  }

  createCommande(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(this.commandesUrl, commande);
  }

  updateCommande(commande: Commande): Observable<any> {
    return this.http.put<any>(`${this.commandesUrl}/${commande.id}`, commande);
  }

  updateCommandeStatus(id: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.commandesUrl}/${id}/status`, { status });
  }

  deleteCommande(id: number): Observable<any> {
    return this.http.delete<any>(`${this.commandesUrl}/${id}`);
  }

  // LigneCMD methods
  getLignesCMD(): Observable<LigneCMD[]> {
    return this.http.get<LigneCMD[]>(this.lignesCMDUrl);
  }

  getLigneCMDById(id: number): Observable<LigneCMD> {
    return this.http.get<LigneCMD>(`${this.lignesCMDUrl}/${id}`);
  }

  getLignesCMDByCommandeId(commandeId: number): Observable<LigneCMD[]> {
    return this.http.get<LigneCMD[]>(`${this.lignesCMDUrl}/commande/${commandeId}`);
  }

  createLigneCMD(ligneCMD: LigneCMD): Observable<LigneCMD> {
    return this.http.post<LigneCMD>(this.lignesCMDUrl, ligneCMD);
  }

  updateLigneCMD(ligneCMD: LigneCMD): Observable<any> {
    return this.http.put<any>(`${this.lignesCMDUrl}/${ligneCMD.id}`, ligneCMD);
  }

  deleteLigneCMD(id: number): Observable<any> {
    return this.http.delete<any>(`${this.lignesCMDUrl}/${id}`);
  }
  
  deleteLignesCMDByCommandeId(commandeId: number): Observable<any> {
    return this.http.delete<any>(`${this.lignesCMDUrl}/commande/${commandeId}`);
  }
}