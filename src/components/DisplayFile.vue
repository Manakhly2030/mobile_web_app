<template>
   <div id="DisplayFileModal" class="DisplayFileModal">
        <div class="DisplayFile-content">
          <h3 class="close" @click="closeModal()">&times;</h3>

      <!-- Modal content -->
            <img style="width:100vw;" v-if="this.file_type==='PNG'" v-bind:src="'data:image/png;base64,'+this.content" />
            <img style="width:100vw;" v-if="this.file_type==='JPEG'" v-bind:src="'data:image/jpeg;base64,'+this.content" />
            <iframe  style="width:93vw;height: 75vh; margin: 0;" v-if="this.file_type==='PDF'" title="PDF" :src="'data:application/pdf;base64,'+this.content"></iframe>   
        </div>
    </div>

  </template>
  
  <script>
  export default {
    props: {
      open: {
        type: Boolean,
        default: true,
      },
      file_name: String,
      docname: String
    },
    data() {
            return {
              file_url :"",
              file_type:"",
              content:"",
            }
    },
    mounted(){
      //clear loader
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.getData() // fetch file

    },
    methods:{
      async getData(){
        this.frappe.customApiCall("api/method/one_fm.api.v1.leave_application.fetch_proof_document",{
          file_name: this.file_name, docname: this.docname, doctype: "Leave Application"}, 'POST').then(res=>{
          if (res.message == "Success"){
            console.log(this.file_name)
            this.file_url = res.data.file_url
            this.file_type =  res.data.file_type
            this.content= res.data.content       
          }
        })
        
      },
        closeModal(){
            $('#DisplayFileModal').hide();
            this.isOpen = false; // Emit an event to open the modal
        },
    }
  };
  </script>
  
<style>
 .DisplayFileModal {
  display: none;
    position: fixed;
    justify-self: center;
    z-index: 1;
    padding-top: 100px;
    left: 0px;
    top: 3vh;
    bottom: 3vh;
    height: 90vh;
    width: 100vw;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
}

/* Modal Content */
.DisplayFile-content {
  background-color: #fefefe;
  margin: 3vh 0vw;
  padding: 10px;
  border: 1px solid #888;
  width: 98vw;
  height: 84vh;
  border-radius: 10px;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
 