import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setLocalStorage = (key: string, value: any): void =>
    localStorage.setItem(key, JSON.stringify(value));
  getLocalStorage = (key: string): any => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };
  removeLocalStorage = (key: string): void => localStorage.removeItem(key);
  clearLocalStorage = (): void => localStorage.clear();
  setMultipleLocalStorage = (items: { key: string; value: any }[]): void =>
    items.forEach((item) => {
      this.setLocalStorage(item.key, item.value);
    });

  getMultipleLocalStorage = (keys: string[]): any[] =>
    keys.map((key) => this.getLocalStorage(key));

  removeMultipleLocalStorage = (keys: string[]): void =>
    keys.forEach((key) => {
      this.removeLocalStorage(key);
    });

  setSessionStorage = (key: string, value: any): void =>
    sessionStorage.setItem(key, JSON.stringify(value));

  getSessionStorage = (key: string): any => {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };
  removeSessionStorage = (key: string): void => sessionStorage.removeItem(key);
  clearSessionStorage = (): void => sessionStorage.clear();
  setMultipleSessionStorage = (items: { key: string; value: any }[]): void =>
    items.forEach((item) => {
      this.setSessionStorage(item.key, item.value);
    });

  getMultipleSessionStorage = (keys: string[]): any[] =>
    keys.map((key) => this.getSessionStorage(key));

  removeMultipleSessionStorage = (keys: string[]): void =>
    keys.forEach((key) => {
      this.removeSessionStorage(key);
    });
}
