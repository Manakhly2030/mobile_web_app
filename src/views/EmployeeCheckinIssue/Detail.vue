<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import DisplayFile from '@/components/DisplayFile.vue'

export default {
    'name': 'CheckinIssueDetails',
    data(){
        return {
          employee_data: {},
          name:"",
          status: "",
          log_type: "",
          date: "",
          issue_type: "",
          latitude: "",
          longitude: "",
          workflow_state: "",
          approver_name: "",
          employee_name: "",
     
        }
    },
    mounted(){
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.getData()
    },
    components: {
      Header,
      Footer,
      DisplayFile
    },
    methods:{
      async getData(){
        this.frappe.customApiCall("api/method/one_fm.api.v1.employee_checkin_issue.employee_checkin_issue_details",
        {employee_checkin_issue_id: this.$route.params.eci_id}, 'POST').then(res=>{
          if (res.status_code == 200){
            this.name = this.$route.params.eci_id
            this.log_type = res.data.log_type
            this.employee = res.data.employee
            this.employee_name = res.data.employee_name
            this.issue_type = res.data.issue_type
            this.latitude = res.data.latitude
            this.longitude = res.data.longitude
            this.date = res.data.date
            this.approver_name = res.data.approver_name
            this.workflow_state = res.data.workflow_state
          } else {
            this.notify.error(res.message)
          }
        })
        
      },
      TakeAction(status){
        if (status == "Approved"){
            this.frappe.customApiCall("api/method/one_fm.api.v1.leave_application.leave_approver_action",{
                leave_id: this.name, status: status}, 'POST').then(res=>{
            if(res.status_code == 201){
              this.notify.success("Success", `Checkin Issue ${status}`)
              window.location.reload();
            }
            else{
              this.notify.error("Error", 'There was an error while Approving the checkin issue.')
            }
          })
        }else {
            this.frappe.customApiCall("api/method/one_fm.api.v1.employee_checkin_issue.reject_employee_checkin_issue",{
                employee_id: this.employee_data.employee_id, employee_checkin_issue_id: this.name}, 'POST').then(res=>{
            if(res.status_code == 201){
              this.notify.success("Success", `Checkin Issue ${status}`)
              window.location.reload();
            }
            else{
              this.notify.error("Error", 'There was an error while Rejecting the Checkin Issue.')
            }
          })
        }
      },
    }
}

</script>

<template>
  <!-- Header Start -->
  <Header />
  <!-- Header End -->

  <!-- Body Start -->
    <!-- App Capsule -->
    <div id="appCapsule">
      <div class="section mt-4  detail_card">
        <div>
          <div class="item" >
              <div class="in">
                <h3 style="color:#B87852">{{this.name}}</h3>
                <div style="display:flex; padding:10px">
                    <h4 > Employee: </h4> <h5 style="margin-left: auto;">{{this.employee}}</h5>
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4 > Employee Name: </h4> <h5 style="margin-left: auto;">{{this.employee_name}}</h5>
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4 > Date: </h4> <h5 style="margin-left: auto;">{{this.date}}</h5>
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4> Log Type:</h4> <h5 style="margin-left: auto;">{{this.log_type}}</h5> 
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4 > Issue Type: </h4> <h5 style="margin-left: auto;">{{this.issue_type}}</h5>
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4> Latitude:</h4> <h5 style="margin-left: auto;">{{this.latitude}}</h5> 
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4 > Longitude: </h4> <h5 style="margin-left: auto;">{{this.longitude}}</h5>
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4>  Approver Name:</h4> <h5 style="margin-left: auto;">{{this.approver_name}}</h5> 
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4>  Status:</h4> <h5 style="margin-left: auto;">{{this.workflow_state}}</h5> 
                  </div>
  
          </div>    
        </div>
      </div>

      <div v-if="this.approver_user_id === this.employee_data.user_id && this.workflow_state === 'Pending'" style="display:flex; padding:10px">
          <button class="button-style" v-on:click="TakeAction(`Approved`)"> Approve </button>
          <button class="button-style"  v-on:click="TakeAction(`Rejected`)"> Reject</button>
      </div>
    </div>
    </div>
      <!-- * Transactions -->


      <!-- * App Capsule -->
  <!-- Body End -->

  <!-- Footer Start -->
  <Footer />
  <!-- Footer End -->

</template>
