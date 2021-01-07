import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  currentFileSubject: BehaviorSubject<any>;
  currentFile: Observable<any>;

  filesSubject: BehaviorSubject<any[]>;
  files: Observable<any[]>;

  constructor(private http: HttpClient){
    this.currentFileSubject = new BehaviorSubject<any>({});
    this.currentFile = this.currentFileSubject.asObservable();

    this.filesSubject = new BehaviorSubject<any[]>([]);
    this.files = this.filesSubject.asObservable();
  }

  public get currentFileValue(){
    return this.currentFileSubject.value;
  }

  emitFilesSubject(files: any[]) {
    this.filesSubject.next(files);
    console.log(this.filesSubject.value);
  }

  emitCurrentFileSubject(currentFile: any) {
    this.currentFileSubject.next(currentFile);
    console.log(this.currentFileSubject.value);
  }

  getBlobById(id: number){
    return this.http.get('http://localhost:8080/morceaux/' + id);
  }

  convertDataURIToBinary(dataURI) {
    const BASE64_MARKER = ';base64,';
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
}
