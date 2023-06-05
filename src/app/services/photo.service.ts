import { Injectable } from '@angular/core';
import {Camera , CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import { Directory,Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';



@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] =[];
  constructor() { }

  public async addNewToGallery(){
    // Prendre une photo
    const capturedPhoto = await Camera.getPhoto(
      {
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      }
    );

    // Sauvegarde de l'image et ajout à la collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
  }
  private async savePicture(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime()+'.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    return {
      filePath: fileName,
      webViewPath: photo.webPath
    }
  }
  private async readAsBase64(photo: Photo) {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise( (resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  } );
}


export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
} 
