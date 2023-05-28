import * as Cesium from 'cesium'
import {viewer} from '../BaseCesium';
//场景出图 
const exportImage = (option:object) => { 
    let opt:any = option || {}; 
    //是否下载图片，默认为true 
    opt.download = Cesium.defaultValue(opt.download, true); 
    //指定图片类型，默认为image/jpeg 
    opt.type = Cesium.defaultValue(opt.type, "image/jpeg"); 
    let width, height; 
    //回调，用于场景图片查看 
    let callback = opt.callback; 
    //渲染场景，不加会出现导出是一张黑乎乎的图片 
    viewer.render(); 
    //生成图片base64编码,type：图片格式，encoderOptions：图片质量，取值[0,1]，默认值0.92 
    let imageData = viewer.canvas.toDataURL(opt.type, opt.encoderOptions)
    if(Cesium.defined(opt.width) || Cesium.defined(opt.height)){ 
        //指定宽度或者高度后对图片进行压缩处理 
        let image = new Image(); 
        image.onload = _ => { 
            if(Cesium.defined(opt.width)) {
                width = opt.width; height = opt.height || Math.round(width * viewer.canvas.height / viewer.canvas.width) 
            }else{ 
                height = opt.height; width = Math.round(height * viewer.canvas.width / viewer.canvas.height) ; 
            } 
            let canvas, ctx; 
            canvas = document.createElement('canvas'); 
            canvas.width = width; 
            canvas.height = height; 
            ctx = canvas.getContext('2d'); 
            ctx!.drawImage(image, 0, 0, width, height); 
            let imageDataNew = canvas.toDataURL(opt.type, opt.encoderOptions); 
            if(!opt.fileName){ 
                opt.fileName = `场景出图_${width}x${height}` 
            } 
            if(opt.download){ 
                downloadBase64Image(opt.fileName, imageDataNew); 
            } 
            if(callback){ 
                callback(imageDataNew, { 
                    width: width, 
                    height: height 
                }) 
            } 
       } 
       image.src = imageData; 
   }else{ 
       //高清原图 
       width = viewer.canvas.width; 
       height = viewer.canvas.height; 
       if(!opt.fileName){ 
           opt.fileName = `场景出图_${width}x${height}` 
       } 
       if(opt.download){ 
           downloadBase64Image(opt.fileName, imageData); 
       } 
       if(callback){ 
           callback(imageData, {
               width: width, height: height 
           }) 
       } 
  } 
} 
// base64转Blob对象 
const base64ToBlob = (code:any) => { 
    let parts = code.split(";base64,"); 
    let contentType = parts[0].split(":")[1]; 
    let raw = window.atob(parts[1]); 
    let rawLength = raw.length; 
    let uint8Array = new Uint8Array(rawLength); 
    for (let i = 0; i < rawLength; i++) { 
        uint8Array[i] = raw.charCodeAt(i); 
    } 
    return new Blob([uint8Array],{type: contentType}); 
} 
//文件下载 
const download = (fileName:string, blob:any) => { 
    //创建a标签 
    const a = document.createElement('a'); 
    //设置下载文件名 
    a.download = fileName; 
    // 将 Blob 对象的 URL 赋值给 a 标签的 href 属性 
    a.href = URL.createObjectURL(blob); 
    // 将a标签暂时添加到 body 中，触发下载 
    document.body.appendChild(a); 
    a.click(); 
    // 下载完成后，将 a 标签从 body 中移除 
    document.body.removeChild(a); 
} 
//base64编码图片下载 
const downloadBase64Image = (fileName:string, imageData:object) => { 
    //创建blob对象 
    const blob = base64ToBlob(imageData); 
    //下载图片
    download(fileName + '.png', blob); 
}
export{
    exportImage
}