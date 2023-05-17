import * as Cesium from 'cesium'

let viewer:any;
const initCesium = (cesiumId: string) => {
    viewer = new Cesium.Viewer(cesiumId, {
        selectionIndicator: false, //是否启用地图选择
        geocoder: false,   //搜索按钮，地名查找
        navigationHelpButton: false,  //帮助按钮
        baseLayerPicker: false,   //底图选择按钮
        homeButton: false,   //主页按钮
        sceneModePicker: false, //二三维切换按钮（场景选择）
        infoBox: false,           //是否显示弹窗
        //默认展示天地图
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url: 'http://t0.tianditu.com/img_w/wmts?service=wmts&tk=60f76905b9b6dff60480f6c4c94f6b18&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles',
          layer: "img",
          style: "default",
          format: "tiles",
          tileMatrixSetID: "w",
          credit: new Cesium.Credit("天地图全球影像服务"),
          subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
          maximumLevel: 18,
        })
    })
}
export{
    viewer,
    initCesium
}