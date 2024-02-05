import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../Services/chat.service';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../Services/socket.service';
import { AuthService } from '../../Services/auth.service';
import { TextTransformPipe } from '../../Pipes/text-transform.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, TextTransformPipe, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  to: any = ''
  me: any = {}
  messages: any = []
  data = this.chatService.messages
  contactsData = this.authService.contacts
  userData = this.authService.userData
  searchData = this.authService.serchUsers
  allSearchData = this.authService.allSerchUsers
  contacts: any = []
  searchUsers: any = []
  allSearchUsers: any = []
  dropdownShow: boolean = false
  allUsersDropDownShow: boolean = false

  constructor(private router: Router, private chatService: ChatService, private socket: SocketService, private authService: AuthService) {
    if (!localStorage.getItem("user_token")) {
      this.router.navigate(['/login']);
    }

    this.authService.getUser()
  }


  ngOnInit() {

    this.socket.onEvent('newMessage').subscribe((data) => {
      if (data.to == this.me._id) {
        this.authService.getUserContacts()
      }
      if (data.from == this.to && data.to == this.me._id) {
        this.messages.push(data)
        this.chatService.setMessageStatus(this.to)

      }
    });


    // get my account user data
    this.userData.subscribe(
      data => {
        this.me = data.user
      }
    )


    // get userContacts
    this.authService.getUserContacts();
    this.contactsData.subscribe(
      data => {
        this.contacts = data.contacts
      }
    )
  }


  handelSubmit(data: any) {
    this.chatService.sendMessage({ content: data.value.content, to: this.to }).subscribe(
      data => {
        this.messages.push(data.message)
        this.authService.getUserContacts()
      }
    )
    // reset the form
    data.resetForm();
  }



  setToUserId(id: any) {
    this.to = id
    this.chatService.fetchMessages(this.to);
    this.data.subscribe(
      data => {
        this.messages = data.messages
        console.log(this.messages)
      }
    )

    this.chatService.setMessageStatus(this.to)
    this.dropdownShow = false
  }


  handleSearch(e: any) {

    this.authService.userSearch(e.target.value, "contacts")
    this.searchData.subscribe(
      data => {
        this.searchUsers = data.users
      }
    )


    if (e.target.value == '' || e.target.value == undefined) {
      this.dropdownShow = false


    } else {
      this.dropdownShow = this.searchUsers.length > 0;

    }

  }



  handleAllSearch(e: any) {

    this.authService.allUserSearch(e.target.value, "other")
    this.allSearchData.subscribe(
      data => {
        this.allSearchUsers = data.users
      }
    )


    if (e.target.value == '' || e.target.value == undefined) {
      this.allUsersDropDownShow = false


    } else {
      this.allUsersDropDownShow = this.allSearchUsers.length > 0;

    }

  }


  logOut() {
    localStorage.removeItem("user_token")
    this.router.navigate(['/login'])
  }

  handleAddContact(id: any) {
    this.to = id
    console.log("clicked")

    this.authService.addContact(id)
    this.chatService.fetchMessages(id);
    this.allUsersDropDownShow = false

  }


}
