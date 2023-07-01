<!--openlayers鹰眼-->
<template>
    <div id="cesiumContainer"></div>
    <div id="eye"></div>
    <div class="home-icon" @click="backHome" title='返回首页'>
        <img
            src="@/assets/close.svg"
            :style="{ transform: 'rotate(-90deg)'}"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted,nextTick } from 'vue'
import * as Cesium from 'cesium'
import { useRouter } from 'vue-router';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import {getCurrentExtent,getCenter} from '../../components/baseScene'

export default defineComponent({
    setup() {
        //三维球
        const initViewer = (id:string) => {
            let viewer = new Cesium.Viewer(id, {
                navigationHelpButton: false,
                sceneModePicker: false,
                geocoder: false,
                homeButton: false,
                fullscreenButton: false,
                imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.com/img_w/wmts?service=wmts&tk=347521453441f82bd83c6f0b15240e50&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                    layer: "tdtBasicLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    maximumLevel: 18,
                }),
                baseLayerPicker: false,
                selectionIndicator: false, //鼠标点击wms选择框
                infoBox: false,
                timeline: false,
                animation: false
            });
            let dom = <HTMLElement>viewer.cesiumWidget.creditContainer
            dom.style.display = "none";
            return viewer;
        };
        const addLabel = (viewer:any) =>{
            let labelLayer = new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&tk=e3af6e89f787c2469373e3aea76f4d36&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
                layer: "tdtImgAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
            })
            viewer.imageryLayers.addImageryProvider(labelLayer);
        }; 
        //二维地图--鹰眼
        const initMap = (id:string) => {
            let layer = new TileLayer({
                // source: new OSM(),
                source:  new XYZ({
                    url: 'https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
                    wrapX: true,
                    crossOrigin: 'anonymous'
                })
            })
            let map = new Map({
                layers: [layer],
                target: id,
                view: new View({
                    projection: 'EPSG:4326',
                    center: [116.240601, 39.827107],
                    zoom: 3
                })
            })
            return map;
        };
        let viewer:any = null;
        let map:any = null;
        onMounted(() => {
            nextTick(() => {
                viewer = initViewer('cesiumContainer');
                addLabel(viewer);
                map = initMap('eye');
                // 添加Cesium 视图监听事件
                viewer.scene.postRender.addEventListener(sceneRenderHandler); 
            })
        });
        const sceneRenderHandler = () => {
            //获取Cesium当前视图的范围
            let extent = getCurrentExtent(viewer)
            //获取Cesium当前视图的中心点
            let point = getCenter(viewer);
            let mapView = map.getView();
            if(extent.xmin == -180 && extent.xmax == 180 && extent.ymin == -90 && extent.ymax == 90){
                //整个地球在视域内
                mapView.animate({zoom:2},{
                    center: [point?.lon,point?.lat],
                    duration: 0
                })
            }else{
                // 根据当前地图范围和大小获取 分辨率
                let r = mapView.getResolutionForExtent([extent.xmin,extent.ymin,extent.xmax,extent.ymax],map.getSize());
                // 设置分辨率
                mapView.setResolution(r);
                // 设置鹰眼图中心点
                mapView.setCenter([point?.lon,point?.lat]);
            }
        }
      
        const router = useRouter()
        const backHome = () => {
            router.push('/home');
        }
        return {
            backHome
        }
    },
})
</script>


<style lang="scss" scoped>
#cesiumContainer{
    width: 100%;
    height: 100vh;
}
#eye {
    position: absolute;
    width: 20%;
    height: 20%;
    bottom: 0;
    right: 0;
    z-index: 2;
    // background: red;
    border: solid blue 1px;
}
.home-icon{
    position: absolute;
    left:0;
    top:0;
    background: #fff;
    cursor: pointer;
}
</style>
<style>
/* 隐藏地图许可证信息 */
.ol-attribution, .ol-zoom, .ol-rotate{
    display: none;
}

</style>

