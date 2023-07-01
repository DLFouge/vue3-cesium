<template>
     <div class="treeSide" v-show="isExpand">
        <div class="treeSide-name">vue3-cesium</div>
        <el-tree 
            :data="treeData" 
            :props="{
                label: 'label',
                children: 'children'
            }"
            ref="treeForm"
            node-key="id"
            show-checkbox  
            check-on-click-node
            check-strictly
            @check-change="handleNodeClick"
            :default-expanded-keys="['satellite']"
            />
    </div>
    <div class="expand-icon" @click="isExpand = !isExpand" title="菜单" :style="{'margin-left': isExpand ? '210px' : 0}">
        <img
            src="@/assets/close.svg"
            :style="{ transform: isExpand ? 'rotate(-90deg)' : 'rotate(90deg)'}"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {loadBoundary,removeBoundary} from './MarkLayer';
export default defineComponent({
    setup() {
        const isExpand = ref(false);
        const treeData = [{
            id: 'boundary',
            label: "反选遮罩层"
            
        }];
        const treeForm = ref();
        const checkedId = ref('');
        interface nodeObject{
            id: string
        }
        const handleNodeClick = (data:nodeObject, checked:boolean) => {
            removeBoundary(); //反选遮罩层
            if(checked){
                checkedId.value = data.id;
                treeForm.value.setCheckedKeys([data.id]);
                switch(data.id){
                    case "boundary":
                        loadBoundary();
                        break;
                    default:
                        break;
                }
            }
        }
        return{
            isExpand,
            treeData,
            treeForm,
            handleNodeClick,
        }
    },
})
</script>

<style scoped lang="scss">
.treeSide{
    height: 82vh;
    width:210px; 
    position: absolute;
    overflow-y: scroll;
    z-index:100;
    top:0px;
    background: #fff;
    // background: rgba(60, 60, 60, 0.8);
    &-name{
        color: red;
        margin-top:10px;
        margin-bottom:10px;
    }
}
.expand-icon {
    width: 32px;
    height: 32px;
    line-height: 32px;
    background: #fff;
    cursor: pointer;
    position: absolute;
    z-index: 2;
    top: 0;
}
</style>

<style lang="scss">
.treeSide{
    .el-checkbox__inner {
        border-radius: 50%;
        border: 1px solid #409eff
    }
}
</style>