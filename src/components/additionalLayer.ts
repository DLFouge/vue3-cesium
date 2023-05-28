import * as Cesium from 'cesium';
import {viewer} from './BaseCesium';


const addAdditionalLayerOption = async(name:string,imageryProviderPromise:any,alpha:number,show:boolean) => {
    try {
        const imageryProvider = await Promise.resolve(imageryProviderPromise);
        const layer:any = new Cesium.ImageryLayer(imageryProvider, {});
        layer.alpha = Cesium.defaultValue(alpha, 0.5);
        layer.show = Cesium.defaultValue(show, true);
        layer.name = name;
        viewer.imageryLayers.add(layer);
        return layer
    } catch (error) {
        console.error(`There was an error while creating ${name}. ${error}`);
    }
}

export{
    addAdditionalLayerOption,
}