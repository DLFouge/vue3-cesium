<template>
    <div id="cesiumContainer" class="cesiumContainer"></div> 
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import {initCesium} from '../components/BaseCesium';
export default defineComponent({
    setup(){
        onMounted(async() => {
            initCesium("cesiumContainer");
        })
    }
})
</script>

<style lang="scss" scoped>
.cesiumContainer{
    width: 100%;
    height:100vh;
    background-image: url(../assets/back.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
</style>
<style>
/* 去除版权信息 */
.cesium-viewer-bottom{
    display:none;
}
</style>