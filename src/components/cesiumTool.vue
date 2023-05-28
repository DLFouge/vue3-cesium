<template>
    <!-- cesium工具栏 -->
    <div class="cesiumTools" >
        <!-- 场景出图 -->
        <expImage/>
        <!-- 天空盒子显示与隐藏 -->
        <img :class="skyboxStatus == true ? 'active': 'default'" src="@/assets/skybox.svg" @click="skyboxCheck"/>    
        
    </div>
</template>

<script lang="ts">
import { defineComponent,ref} from 'vue';
import {addPostRender,removePostRender} from './skyBox.js'
import expImage from "../components/exportImage/index.vue"

export default defineComponent({
    components:{
        expImage
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
        return {
            skyboxStatus,
            skyboxCheck
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