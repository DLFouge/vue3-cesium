import * as Cesium from 'cesium'
/* 获取camera高度  */
const getHeight = (viewer:any) => {
    let scene = viewer.scene;
    let ellipsoid = scene.globe.ellipsoid;
    let height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
    return height;
};
//获取当前场景范围
const getCurrentExtent = (viewer:any) =>{
    // 范围对象默认值--中国区域
   let extent:any = {
        xmin: 70,
        xmax: 140,
        ymin: 0,
        ymax: 55,
        height: 0
    };
    // 得到当前三维场景
    let scene = viewer.scene;
    // 得到当前三维场景的椭球体
    let ellipsoid = scene.globe.ellipsoid;
    let canvas = scene.canvas;
    // canvas左上角
    let car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);
    if (car3_lt) {
        // 在椭球体上
        let carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
        extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
        extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
        extent.height = Math.max(extent.height, carto_lt.height);
    } else {
        // 不在椭球体上 
        let xMax = canvas.width / 2;
        let yMax = canvas.height / 2;
        let car3_lt2;
        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
        for (let yIdx = 0; yIdx <= yMax; yIdx += 10) {
            let xIdx = yIdx <= xMax ? yIdx : xMax;
            car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIdx, yIdx), ellipsoid);
            if (car3_lt2) break;
        }
        if (car3_lt2) {
            let carto_lt = ellipsoid.cartesianToCartographic(car3_lt2);
            extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
            extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
            extent.height = Math.max(extent.height, carto_lt.height);
        }
    }
    // canvas右下角
    let car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid);
 	if (car3_rb) {
        // 在椭球体上
        let carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
        extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
        extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
        extent.height = Math.max(extent.height, carto_rb.height);
    } else {
        // 不在椭球体上
        let xMax = canvas.width / 2;
        let yMax = canvas.height / 2;

        let car3_rb2;
        // 这里每次10像素递减，一是10像素相差不大，二是为了提高程序运行效率
        for (let yIdx = canvas.height; yIdx >= yMax; yIdx -= 10) {
            let xIdx = yIdx >= xMax ? yIdx : xMax;
            car3_rb2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIdx, yIdx), ellipsoid);
            if (car3_rb2) break;
        }
        if (car3_rb2) {
            let carto_rb = ellipsoid.cartesianToCartographic(car3_rb2);
            extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
            extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
            extent.height = Math.max(extent.height, carto_rb.height);
        }
    }
    return extent; 
};
//格式化 数字 小数位数
const formatNum = (num:number, digits: number) =>{
    return Number(Number(num).toFixed(digits || 0));
};
//取屏幕中心点坐标
const pickCenterPoint = (scene:any) => {
    let canvas = scene.canvas;
    let center = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2);
    let ray = scene.camera.getPickRay(center);
    let target = scene.globe.pick(ray, scene);
    if (!target) target = scene.camera.pickEllipsoid(center);
    return target;
};
//提取屏幕中心点坐标
const getCenter = (viewer:any) =>{
    let position = pickCenterPoint(viewer.scene);
    if (!position) return null;
    let carto = Cesium.Cartographic.fromCartesian(position);
    let result:any = {};
    result.lat = formatNum(Cesium.Math.toDegrees(carto.latitude), 6);
    result.lon = formatNum(Cesium.Math.toDegrees(carto.longitude), 6);
    result.height = formatNum(carto.height, 2);
    return result;
}

export{
    getCenter,
    getCurrentExtent,
    getHeight
}