import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setLocalStorage = (key: string, value: any): void =>
    this.setStorage(1, key, value);
  getLocalStorage = (key: string): any => this.getStorage(1, key);
  removeLocalStorage = (key: string): void => this.removeStorage(1, key);
  clearLocalStorage = (): void => localStorage.clear();
  setMultipleLocalStorage = (items: { key: string; value: any }[]): void =>
    this.setMultipleStorage(1, items);
  getMultipleLocalStorage = (keys: string[]): any[] =>
    this.getMultipleStorage(1, keys);
  removeMultipleLocalStorage = (keys: string[]): void =>
    this.removeMultipleStorage(1, keys);

  setSessionStorage = (key: string, value: any): void =>
    this.setStorage(2, key, value);
  getSessionStorage = (key: string): any => this.getStorage(2, key);
  removeSessionStorage = (key: string): void => this.removeStorage(2, key);
  clearSessionStorage = (): void => sessionStorage.clear();
  setMultipleSessionStorage = (items: { key: string; value: any }[]): void =>
    this.setMultipleStorage(2, items);
  getMultipleSessionStorage = (keys: string[]): any[] =>
    this.getMultipleStorage(2, keys);
  removeMultipleSessionStorage = (keys: string[]): void =>
    this.removeMultipleStorage(2, keys);

  private setStorage = (type: number, key: string, value: any): void =>
    (type == 1 ? localStorage : sessionStorage).setItem(
      key,
      JSON.stringify(value),
    );
  private getStorage = (type: number, key: string): any => {
    const value = (type == 1 ? localStorage : sessionStorage).getItem(key);
    return value ? JSON.parse(value) : null;
  };
  private removeStorage = (type: number, key: string): void =>
    (type == 1 ? localStorage : sessionStorage).removeItem(key);
  private setMultipleStorage = (
    type: number,
    items: { key: string; value: any }[],
  ): void =>
    items.forEach((item) => this.setStorage(type, item.key, item.value));
  private getMultipleStorage = (type: number, keys: string[]): any[] =>
    keys.map((key) => this.getStorage(type, key));
  private removeMultipleStorage = (type: number, keys: string[]): void =>
    keys.forEach((key) => {
      this.removeStorage(type, key);
    });
}
