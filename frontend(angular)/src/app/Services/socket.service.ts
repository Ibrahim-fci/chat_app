import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  public globalEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    // Replace 'http://localhost:3000' with your server's URL
    this.socket = io('http://localhost:8000');



  }

  emitEvent(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
    this.globalEvent.emit(data);
  }

  // onEvent(eventName: string, callback: (data: any) => void): void {
  //   this.socket.on(eventName, callback);
  // }

  onEvent(eventName: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });
    });
  }






}
