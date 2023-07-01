<!--卷帘-->
<template>
    <div id="cesiumContainer"></div>
    <div id="slider"></div>
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
            return viewer;
        };
        let moveActive = false;
        let slider:any;
        const setLeft = (viewer:any) => {
            //加载arcgis地图服务
            const leftLayer = viewer.imageryLayers.addImageryProvider(
                new Cesium.ArcGisMapServerImageryProvider({
                    url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
                })
            );
            // 设置arcgis服务显示在卷帘左侧
            leftLayer.splitDirection = Cesium.SplitDirection.LEFT;
            //cesium鼠标事件处理
            setLeftSlider(viewer);
        };
        const setLeftSlider = (viewer:any) => {
            slider = <any>document.getElementById("slider");
            if(slider){
                //设置场景分割器位置
                viewer.scene.splitPosition = slider.offsetLeft / slider.parentElement?.offsetWidth!;
                //绑定滑块dom，便于后续添加cesium事件
                const handler = new Cesium.ScreenSpaceEventHandler(slider);
               //cesium事件注册，用于设置滑块是否可移动，以及监听滑块位置变化
                //鼠标事件
                //鼠标左键按下事件--允许滑块移动
                handler.setInputAction(() =>{
                    moveActive = true;
                }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                //鼠标移动事件--监听滑块移动，然后计算场景分割器位置
                handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                // 鼠标左键向上事件--禁止滑块移动
                handler.setInputAction(() => {
                    moveActive = false;
                }, Cesium.ScreenSpaceEventType.LEFT_UP);
        
                //触摸事件
                //触摸表面上两指事件的开始
                handler.setInputAction(() => {
                    moveActive = true;
                }, Cesium.ScreenSpaceEventType.PINCH_START);
                //触摸表面上两指事件的变化
                handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);
                // 触摸表面上的两指事件的结束
                handler.setInputAction(() => {
                    moveActive = false;
                }, Cesium.ScreenSpaceEventType.PINCH_END);
            } 
        };
        const move = (movement:any) => {
            if(!moveActive){
                return;
            }
            // 获取鼠标移动处x坐标
            const relativeOffset = movement.endPosition.x;
            // 计算分割器位置
            const splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
            //设置滑块dom位置
            slider.style.left = `${100.0 * splitPosition}%`;
            //设置场景分割器位置
            viewer.scene.splitPosition = splitPosition;
        }
        let viewer:any = null;
        onMounted(() => {
            nextTick(() => {
                viewer = initViewer("cesiumContainer");
                setLeft(viewer)
            })
        });
        const router = useRouter()
        const backHome = () => {
            router.push('/home');
        };
        return {
            backHome,
        }
    },
})
</script>


<style lang="scss" scoped>
#cesiumContainer{
    width: 100%;
    height: 100vh;
}
#slider{
    position: absolute;
    left: 50%;
    top: 0px;
    background-color: #d3d3d3;
    width: 3px;
    height: 100%;
    z-index: 9999;
}
#slider:hover {
    cursor: e-resize;
}

.home-icon{
    position: absolute;
    left:0;
    top:0;
    background: #fff;
    cursor: pointer;
}
.swipeBtn{
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>
