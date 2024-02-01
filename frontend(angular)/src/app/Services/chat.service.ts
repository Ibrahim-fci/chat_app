import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { AuthService } from './auth.service';
import { Host } from '../constants';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private data = new BehaviorSubject<any>(null);
  public messages = this.data.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  sendMessage(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('user_token')}`,
    });

    const message = this.http.post(`${Host}/messages/send/`, body, { headers });
    return message
  }



  fetchMessages(to: any) {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('user_token')}`,
    });

    const messages = this.http.get(`${Host}/messages/${to}`, { headers }).subscribe(

      data => {

        this.data.next(data)
      }
    )
    return messages;
  }


  setMessageStatus(id: any) {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('user_token')}`,
    });

    const message = this.http.get(`${Host}/messages/status/${id}`, { headers }).subscribe(
      data => {
        console.log(data)
        this.authService.getUserContacts()
      }
    )
  }
}
