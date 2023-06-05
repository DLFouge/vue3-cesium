<template>
    <!-- cesium工具栏 -->
    <div class="cesiumTools" >
        <!-- 多视图 -->
        <baseScene/>
        <!-- 场景出图 -->
        <expImage/>
        <!-- 天空盒子显示与隐藏 -->
        <img :class="skyboxStatus == true ? 'active': 'default'" src="@/assets/skybox.svg" @click="skyboxCheck" title="天空盒子"/>    
        <!-- 瓦片编号 -->
        <img :class="tileStatus == true ? 'active': 'default'" src="@/assets/tile.svg" @click="tileCheck" title="瓦片编号"/>   
        <!-- 网格 -->
        <img :class="gridStatus == true ? 'active': 'default'" src="@/assets/grid.svg" @click="gridCheck" title="网格"/>   
    </div>
</template>

<script lang="ts">
import { defineComponent,ref} from 'vue';
import * as Cesium from 'cesium';
import {addPostRender,removePostRender} from './skyBox.js'
import expImage from "../components/exportImage/index.vue"
import {addAdditionalLayerOption} from "../components/additionalLayer"
import baseScene from '../views/multiView/index.vue'

export default defineComponent({
    components:{
        expImage,
        baseScene
    },
    setup() {
        //天空盒子
        const skyboxStatus = ref(false);
        const skyboxCheck = () => {
            skyboxStatus.value = !skyboxStatus.value;
            if(skyboxStatus.value){
                addPostRender();
            }else{
                removePostRender()
            }
        };
        // 瓦片编号
        const tileStatus = ref(false);
        const tileLayer:any = ref(null);
        const tileCheck = () => {
            tileStatus.value = !tileStatus.value;
            if(tileStatus.value){
                if(tileLayer.value){
                    tileLayer.value.then((res:any) => {
                        res.show = true;
                    })
                }else{
                    tileLayer.value = addAdditionalLayerOption("TileCoordinates",new Cesium.TileCoordinatesImageryProvider(),1.0,true);
                } 
            }else{
                tileLayer.value.then((res:any) => {
                    res.show = false;
                })
            }
            
        };
        // 网格
        const gridStatus = ref(false);
        const gridLayer:any= ref(null)
        const gridCheck = () => {
            gridStatus.value = !gridStatus.value;
            if(gridStatus.value){
                if(gridLayer.value){
                    gridLayer.value.then((res:any) => {
                        res.show = true;
                    })
                }else{
                    gridLayer.value = addAdditionalLayerOption("Grid",new Cesium.GridImageryProvider({}),1.0,true);
                }
                
            }else{
                gridLayer.value.then((res:any) => {
                    res.show = false;
                })
            }
            
        };
        return {
            skyboxStatus,
            skyboxCheck,
            tileStatus,
            tileCheck,
            gridStatus,
            gridCheck
        }
    },
})
</script>

<style lang="scss" scoped>
.cesiumTools{
    position: absolute;
    right: 10px;
    top: 10px;
    background: rgba(60, 60, 60, 0.8);
    padding: 5px;
    display: flex; 
    img{
        width: 20px;
        height: 20px;
        cursor: pointer;
        margin-right: 10px;
    }
    .active{
        border: 1px solid rgb(0, 255, 242);
        background: rgba(0, 255, 242, 0.8);
    }
    .default{
        border: unset;
        background:unset;
    }
}

</style>