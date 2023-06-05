import * as Cesium from 'cesium'
//获取地图中心点
const getCenter = (viewer:any) =>{
    let result = viewer.camera.pickEllipsoid(
    new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2)
    );
    if (!result) { 
    return null;
    }
    let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
    let lon = curPosition.longitude * 180 / Math.PI;
    let lat = curPosition.latitude * 180 / Math.PI;
    let height = getHeight(viewer);
    return {
        lon: lon,
        lat: lat,
        height: height
    };
};
/* 获取camera高度  */
const getHeight = (viewer:any) => {
    let scene = viewer.scene;
    let ellipsoid = scene.globe.ellipsoid;
    let height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
    return height;
};
//获取当前场景范围
const getCurrentExtent = (viewer:any) =>{
    // 范围对象
    let extent = <any>{};
    // 得到当前三维场景
    let scene = viewer.scene;
    // 得到当前三维场景的椭球体
    let ellipsoid = scene.globe.ellipsoid;
    let canvas = scene.canvas;
    // canvas左上角
    let car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);
    // canvas右下角
    let car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid);
    let yIndex = 0;
    let xIndex = 0;
    // 当canvas左上角和右下角全部在椭球体上
    if (car3_lt && car3_rb) {
    let carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
    let carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
    extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
    extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
    extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
    extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
    }else if(!car3_lt && car3_rb){ // 当canvas左上角不在但右下角在椭球体上
    let car3_lt2 = null;
    yIndex = 0;
    do {
        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
        yIndex <= canvas.height ? yIndex += 10 : canvas.height;
        car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, yIndex), ellipsoid);
    } while (!car3_lt2);
    let carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
    let carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
    extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
    extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
    extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
    extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude)
    }else if(car3_lt && !car3_rb){ // 当canvas左上角在但右下角不在椭球体上
    let car3_rb2 = null;
    yIndex = canvas.height;
    xIndex = canvas.width;
    do {
        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
        yIndex >= 10 ? yIndex -= 10 : 10;
        xIndex >= 10 ? xIndex -= 10 : 10;
        car3_rb2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(yIndex, yIndex), ellipsoid);
    } while (!car3_rb2);
    let carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt);
    let carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb2);
    extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
    extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
    extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
    extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
    }else if(!car3_lt && !car3_rb){ //canvas左上角和右下角都不在椭球体上
    let car3_lt2 = null;
    yIndex = 0;
    xIndex = 0;
    do {
        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
        yIndex <= canvas.height ? yIndex += 10 : canvas.height;
        xIndex <= canvas.width ? xIndex += 10 : canvas.width;
        car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIndex, yIndex), ellipsoid);
    } while (!car3_lt2);
    let car3_rb2 = null;
    yIndex = canvas.height;
    xIndex = canvas.width;
    do {
        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
        yIndex >= 10 ? yIndex -= 10 : 10;
        xIndex >= 10 ? xIndex -= 10 : 10;
        car3_rb2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(yIndex, yIndex), ellipsoid);
    } while (!car3_rb2);
    let carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
    let carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb2);
    extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
    extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
    extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
    extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
    }
    // 获取高度
    extent.height = Math.ceil(viewer.camera.positionCartographic.height);
    return extent; 
};

export{
    getCenter,
    getCurrentExtent
}