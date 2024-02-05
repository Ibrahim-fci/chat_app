import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Host } from '../constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private data = new BehaviorSubject<any>(null);
  public userData = this.data.asObservable();

  private contactsData = new BehaviorSubject<any>(null);
  public contacts = this.contactsData.asObservable();

  private searchData = new BehaviorSubject<any>(null);
  public serchUsers = this.searchData.asObservable();

  private allSearchData = new BehaviorSubject<any>(null);
  public allSerchUsers = this.allSearchData.asObservable();

  private toData = new BehaviorSubject<any>(null);
  public toUser = this.toData.asObservable();


  constructor(private http: HttpClient) { }



  signup(body: Object): Observable<any> {
    return this.http.post(`${Host}/users/signup/`, body);
  }

  signin(body: Object): Observable<any> {
    return this.http.post(`${Host}/users/signin/`, body);
  }

  getUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('user_token')}`,
    });

    const user = this.http.get(`${Host}/users/me/`, { headers });
    user.subscribe(

      data => {
        this.data.next(data)
      }
    )
    return user
  }


  getUserContacts(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('user_token')}`,
    });
    const contacts = this.http.get(`${Host}/users/contacts/`, { headers });
    contacts.subscribe(data => {
      this.contactsData.next(data)
    })

    return contacts
  }

  userSearch(text: string, type: string): any {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('user_token')}`,
    });
    const contacts = this.http.get(`${Host}/users/search/?username=${text}&email=${text}&type=${type}`, { headers });
    contacts.subscribe(data => {
      this.searchData.next(data)
    })

  }

  allUserSearch(text: string, type: string): any {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('user_token')}`,
    });
    const contacts = this.http.get(`${Host}/users/search/?username=${text}&email=${text}&type=${type}`, { headers });
    contacts.subscribe(data => {
      this.allSearchData.next(data)
    })

  }

  addContact(id: any) {

    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('user_token')}`,
    });
    const contacts = this.http.get(`${Host}/users/contacts/${id}`, { headers });
    contacts.subscribe(data => {
      this.getUserContacts().subscribe(data => {
        this.contactsData.next(data)
      })
    })

  }


  getOne(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('user_token')}`,
    });
    const contacts = this.http.get(`${Host}/users/${id}`, { headers });
    contacts.subscribe(data => {
      this.toData.next(data)
    })

    return contacts
  }


}
