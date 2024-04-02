<template>
   <div id="CheckinIssueModal" class="CheckinIssueModal">
    
        <div class="CheckinIssueModal-content">
            <h3 class="close" @click="closeModal()">&times;</h3>
        <!-- Modal content -->
            <div class="section mt-2">
                    <h3 style="color: black;">Checkin Issue:</h3>
                    <div style="display:flex;padding-bottom: 5px;">
                        <h5 style="color:black; align-self: center;"> Issue Type: </h5>
                        <select v-model="selected" class="issuetype" name="issuetype" @change="onIssueTypeChange($event)">
                            <option disabled value="">Select Issue Type.</option>
                            <option v-for="option in IssueType" :value="option">
                                {{ option }}
                            </option>
                        </select>
                    </div>
                    <div v-if="this.issue_type_select === 'Other'" >
                        <h5 style="color:black;"> Reason:</h5>
                        <textarea id="reason" class="custom_input" v-model="reason" name="reason" rows="2" cols="34">
                        </textarea>
                    </div>
                <button v-on:click="submit" style="background-color: #B87852;border-radius: 10px;padding: 10px; width: 60vw;"> Sumbit </button>
                </div>
            
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
      log_type: String,
      longitude: Number,
      latitude: Number,
    },
    data() {
            return {
                IssueType: ['Camera Failing','App Showing Outside Location','Timeout Issue','Internet Issue','Other'],
                issue_type_select:'',
                employee_data:{},
            }
    },
    mounted(){
      //clear loader
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
    },
    methods:{
        onIssueTypeChange(event){
           this.issue_type_select = event.target.value
        },
        closeModal(){
            $('#CheckinIssueModal').hide();
            this.isOpen = false; // Emit an event to open the modal
        },
        submit : function(){
          this.frappe.customApiCall("api/method/one_fm.operations.doctype.employee_checkin_issue.employee_checkin_issue.create_checkin_issue",{
            "employee": this.employee_data.name,"issue_type":this.issue_type_select, "log_type":this.log_type, "longitude": this.longitude, "latitude": this.latitude, "reason": this.reason}, 'POST').then(res=>{
                if (res.message === "Success"){
                  this.notify.success("Successfully Applied!")
                  window.location.reload();
                } else {
                  this.notify.error('Error', res.message)
                }
            })
        },

    }
  };
  </script>
  
<style>
 .CheckinIssueModal {
    display: none;
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.CheckinIssueModal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 12px;
    border: 1px solid #888;
    width: 85%;
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
.issuetype{
    width: 49vw;
    padding: 5px;
    margin: auto;
    font-size: small;
    border: 2px solid #595c63;
    border-radius: 4px;
}
</style>
 