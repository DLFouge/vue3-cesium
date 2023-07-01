/**
 *  绘制区域边界的反选遮罩层
 *  思路: 首先在中国地图最外画一圈，圈住理论上所有的中国领土，然后再将每个闭合区域合并进来
 **/
import * as Cesium from "cesium";
import axios from "axios";
import {viewer} from "./BaseCesium"

interface GeoJson{
    "type": String,
    "geometry": {
        type: String,
        coordinates: Array<number>
    }
}
interface resObject{
    "data": GeoJson
}
const drawBoundary = (data:GeoJson) => {
    removeBoundary();
    // 中国边界
    let extent = { xmin: 73.0, xmax: 136.0, ymin: 3.0, ymax: 59.0 };
    let geojson = {
        type: 'Feature',
        geometry: {
            type: "MultiPolygon",
            coordinates: [[
                [[extent.xmin,extent.ymin],[extent.xmax,extent.ymin],[extent.xmax,extent.ymax],[extent.xmin,extent.ymax],[extent.xmin,extent.ymin]],
                data.geometry.coordinates[0]
            ]]
        }
    }
    let geoPromise = Cesium.GeoJsonDataSource.load(geojson, {
        stroke: Cesium.Color.fromCssColorString('#39E09B').withAlpha(0.8),
        fill: Cesium.Color.fromCssColorString("rgb(2,26,79)").withAlpha(0.7),
        strokeWidth: 10,
        clampToGround: true
    })
    geoPromise.then((dataSource) => {
        //添加geojson
        viewer.dataSources.add(dataSource);
        //给geojson命名
        dataSource.name = "geojsonBoundary";
        //视角跳转至geojson
        // viewer.flyTo(dataSource.entities.values)
    })

}
const removeBoundary = () => {
    viewer.dataSources.remove(viewer.dataSources.getByName("geojsonBoundary")[0]);
}
const loadBoundary = () => {
    axios.get("/public/geojson/hefei.json").then((res:resObject) => {
        console.log("geojson", res)
        let geojson = res.data;
        drawBoundary(geojson);
    })
}
export{
    loadBoundary,
    removeBoundary
}