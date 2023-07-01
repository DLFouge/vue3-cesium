<!--分屏-->
<template>
    <div class="cesiumDiv">
        <div id="cesiumContainerL"></div>
        <div id="cesiumContainerR"></div>
    </div>
    <div class="home-icon" @click="backHome" title='返回首页'>
        <img
            src="@/assets/close.svg"
            :style="{ transform: 'rotate(-90deg)'}"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent,onMounted,nextTick } from 'vue'
import * as Cesium from 'cesium'
import { useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const setImagery = (pos:string) => {
            if(pos == "left"){
                return new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.com/img_w/wmts?service=wmts&tk=347521453441f82bd83c6f0b15240e50&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                    layer: "tdtBasicLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    maximumLevel: 18,
                })
            }else{
                return new Cesium.ArcGisMapServerImageryProvider({
                    url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
                })
            }
        }
        const initViewer = (id:string,pos:string) => {
            let viewer = new Cesium.Viewer(id, {
                navigationHelpButton: false,
                sceneModePicker: false,
                geocoder: false,
                homeButton: false,
                fullscreenButton: false,
                imageryProvider: setImagery(pos),
                baseLayerPicker: false,
                selectionIndicator: false, //鼠标点击wms选择框
                infoBox: false,
                timeline: false,
                animation: false
            });
            let dom = <HTMLElement>viewer.cesiumWidget.creditContainer
            dom.style.display = "none";
            addLabel(viewer);
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
        let viewerL:any = null;
        let viewerR:any = null;
        onMounted(() => {
            nextTick(() => {
                viewerL = initViewer("cesiumContainerL", "left");
                syncLeftViewer();
                viewerR = initViewer("cesiumContainerR", "right");
                syncRightViewer();
            })
        });
        let isLeftTrigger = false;
        let isRightTrigger = false;
        //右侧viewer与左侧同步--操作左侧
        const syncLeftViewer = () => {
            let canvasL = viewerL.scene.canvas;
            let handlerL = new Cesium.ScreenSpaceEventHandler(canvasL);
            handlerL.setInputAction(() => {
                isLeftTrigger = true;
                isRightTrigger = false; 
            },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            viewerL.camera.changed.addEventListener(syncViewerL);
            viewerL.scene.preRender.addEventListener(syncViewerL);
        };
        const syncViewerL = () => {
            if(isLeftTrigger){
                viewerR.camera.flyTo({
                    destination: viewerL.camera.position,
                    orientation: {
                        heading: viewerL.camera.heading,
                        pitch: viewerL.camera.pitch,
                        roll: viewerL.camera.roll
                    },
                    duration: 0.0
                })
            }
        };
        //左侧viewer与右侧同步--操作右侧
        const syncRightViewer = () => {
            let canvasR = viewerR.scene.canvas;
            let handlerR = new Cesium.ScreenSpaceEventHandler(canvasR);
            handlerR.setInputAction(() => {
                isLeftTrigger = false;
                isRightTrigger = true; 
            },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            viewerR.camera.changed.addEventListener(syncViewerR);
            viewerR.scene.preRender.addEventListener(syncViewerR);
        };
        const syncViewerR = () => {
            if(isRightTrigger){
                viewerL.camera.flyTo({
                    destination: viewerR.camera.position,
                    orientation: {
                        heading: viewerR.camera.heading,
                        pitch: viewerR.camera.pitch,
                        roll: viewerR.camera.roll
                    },
                    duration: 0.0
                })
            }
        };
        const router = useRouter()
        const backHome = () => {
            router.push('/home');
        }
        return{
            backHome,
        }
    },
})
</script>


<style lang="scss" scoped>
.cesiumDiv{
    width: 100%;
    height: 100%;
}
#cesiumContainerL {
    width: 50%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
}
#cesiumContainerR {
    width: 50%;
    height: 100%;
    right: 0;
    bottom: 0;
    position: absolute;
}
.home-icon{
    position: absolute;
    left:0;
    top:0;
    background: #fff;
    cursor: pointer;
}
</style>
