import { Asset } from "expo-asset";

export class Icon {
    constructor(
        public module:string,
        public width:number,
        public height:number
        ) {
        this.module = module;
        this.width = width;
        this.height = height;
        Asset.fromModule(this.module).downloadAsync();
    }
}

export class PlaylistItem {
    constructor(
        public name:string,
        public uri:string,
        public isVideo:boolean
        ) {
        this.name = name;
        this.uri = uri;
        this.isVideo = isVideo;
    }
}
