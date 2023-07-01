<!--cesium鹰眼-->
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

export default defineComponent({
    setup() {
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
        let viewerM:any = null;
        let viewerE:any = null;
        onMounted(() => {
            //1.创建双球
            nextTick(() => {
                viewerM = initViewer('cesiumContainer');
                // addLabel(viewerM);
                viewerE = initViewer('eye');
                // addLabel(viewerE);
                setViewer(viewerE);
                viewerM.scene.preRender.addEventListener(syncViewer); 
            })
        })
        // 2.设置鹰眼图中球属性
        const setViewer = (viewer:any) => {
            let control = viewer.scene.screenSpaceCameraController;
            control.enableRotate = false;
            control.enableTranslate = false;
            control.enableZoom = false;
            control.enableTilt = false;
            control.enableLook = false;
        }
        //3. 同步
        const syncViewer = () =>{
            viewerE.camera.flyTo({
                destination: viewerM.camera.position,
                orientation: {
                    heading: viewerM.camera.heading,
                    pitch: viewerM.camera.pitch,
                    roll: viewerM.camera.roll
                },
                duration: 0.0
            });
        };
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
