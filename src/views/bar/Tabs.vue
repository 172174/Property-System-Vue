<template>
  <el-tabs  v-model="editableTabsValue" type="card"  :closable="editableTabsValue !=='Index'" @tab-remove="removeTab" @tab-click="clickTab">
  <el-tab-pane class="tab"
    v-for="item in editableTabs"
    :key="item.name"
    :label="item.title"
    :name="item.name"
  >
    <!-- {{item.content}} -->
  </el-tab-pane>
</el-tabs>
</template>

<script>
export default {
  name: 'Tabs',
   data() {
      return {
      }
    },
    computed:{
        editableTabsValue:{
          get(){
            return this.$store.state.menu.editableTabsValue
          },
          set(value){
             this.$store.state.menu.editableTabsValue = value
          }
        },
        editableTabs:{
          get(){
            return this.$store.state.menu.editableTabs
          },
          set(value){
             this.$store.state.menu.editableTabs = value
          }
        },
    }
    ,
    methods: {
    
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if(targetName === 'Index'){
          return
        }
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        this.$router.push({name:activeName})
      },

      clickTab(target){
        this.$router.push({name:target.name})
      }
    }
  }
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;


}

</style>