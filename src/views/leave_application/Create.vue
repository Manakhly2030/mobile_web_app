<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    'name': 'LeaveApplication',
    data(){
        return {
          leaveApplication: {
            from_date: "",
            to_date: "",
            reason:"",
            leave_type: "",
            is_proof_document_required: 0,
            proof_document:{},
            employee_id: ''
          },
          employee_data: {},
          leaveTypes: {},
          leaveBalance: {},
          minDate: new Date().toISOString().split("T")[0],
          yesterday:"",
          total_leave_days: 0,
          base64:""
        }
    },
    mounted(){
      //   clear loader
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.leaveApplication.employee_id = this.employee_data.employee_id;
      this.getData() // fetch leave balance
      
    },
    components: {
      Header,
      Footer
    },
    methods:{
      async getData(){
        this.frappe.customApiCall("api/method/one_fm.api.v1.leave_application.get_leave_types",{
          employee_id: this.employee_data.employee_id}, 'POST').then(res=>{
          if (res.message != "Resource Not Found"){
            this.leaveTypes = res.data;
            this.minDate = new Date().toISOString().split("T")[0];
          } else {
            this.notify.error('Error', res.message)
          }
        })
        
      },
      onLeaveTypeChange() {
        this.leaveApplication.is_proof_document_required = this.leaveTypes[this.leaveApplication.leave_type];
        this.frappe.customApiCall("api/method/one_fm.api.v1.leave_application.get_leave_balance",{
          employee_id: this.employee_data.employee_id, 
          leave_type: this.leaveApplication.leave_type}, 'POST').then(res=>{
          if (res.message != "Resource Not Found"){
            if(res.data.remaining_leaves>0){
              this.leaveBalance = res.data;
            } else {
              this.leaveBalance = {};
              this.notify.error('Error', 'You have no leave balance for this leave type')
            }
          } else {
            this.leaveBalance = {};
            this.notify.error('Error', res.error)
          }
        })
        },
        dateChange(){
          if(this.leaveApplication.from_date && this.leaveApplication.to_date){
              this.frappe.customApiCall("api/method/hrms.hr.doctype.leave_application.leave_application.get_number_of_leave_days",{
                "employee": this.employee_data.name,
                "leave_type": this.leaveApplication.leave_type,
                "from_date": this.leaveApplication.from_date,
                "to_date": this.leaveApplication.to_date}, 'POST').then(res=>{
                if (res.message != undefined){
                  this.total_leave_days = res.message;
                  if (this.total_leave_days>this.leaveBalance.remaining_leaves){
                    this.notify.error('Error', 'Total number of days is greater than total leave balance.')
                  }
                } else {
                  this.notify.error('Error', res.message)
                }
            })
          }
        },
        createLeave : function(){
          if (this.total_leave_days <= this.leaveBalance.remaining_leaves &&
              this.leaveApplication.from_date && this.leaveApplication.to_date &&
              this.leaveApplication.leave_type && this.leaveApplication.reason){
              // check for proof document
            if ((!this.leaveApplication.is_proof_document_required) || 
              (this.leaveApplication.is_proof_document_required && 
                Object.keys(this.leaveApplication.proof_document).length)){
                  this.sendLeaveApplication();
            } else {
              this.notify.error('Error', 'Please upload proof document.')
            }
          } else {
            this.notify.error('Error', 'Please fill all the required fields.')
          }
        },
        sendLeaveApplication(){
          document.querySelector('#submitBTN').disabled=1;
          document.querySelector('#submitBTN').textContent='Processing';
          this.frappe.customApiCall(
            "api/method/one_fm.api.v1.leave_application.create_new_leave_application",
            this.leaveApplication, 'POST').then(res=>{
                if (res.message === "Success"){
                  this.notify.success("Successfully Applied!")
                  setTimeout(()=>{
                    window.location.href = `/leave_application/${res.data.name}`;
                  }, 6000);
                } else {
                  this.notify.error('Error', res.error);
                }
            })
        },
        async fetchFile(event){
          var file =  event.target.files[0]
          let result = await this.convertToBase64(file);
          if (result){
            this.leaveApplication.proof_document.attachment_name = event.target.files[0].name;
            this.leaveApplication.proof_document.attachment = result.split(';base64,')[1];
          }
        },
        convertToBase64(file) {
          return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onerror = reject
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.readAsDataURL(file)
        })
        }
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
      <div class="section mt-2">
        <div>
          <h5 style="color:white;"> Leave Type:</h5>
          <select v-model="leaveApplication.leave_type" class="custom_input" style=" " name="leavetype" 
            @change="onLeaveTypeChange" required>
            <option></option>
            <option v-for="(key, value) in leaveTypes" :value="value" :key="value">
              {{ value }}
            </option>
          </select>
        </div>
          <div v-if="Object.keys(leaveBalance).length" class="form_card" >
            <h3 style="color: white;">Available Leaves:</h3>
            <div style="display:flex; padding:10px;">
              <h5 style="color: white;"> Total Leaves:</h5> 
              <h5 style="margin-left: auto;color: white;">{{leaveBalance.total_leaves}}</h5>
            </div>
            <div style="display:flex; padding:10px;">
              <h5 style="color: white;"> Leaves Taken: </h5> 
              <h5 style="margin-left: auto;color: white;">{{leaveBalance.leaves_taken}}</h5>
            </div>
            <div style="display:flex; padding:10px;">
              <h5 style="color: white;"> Expired Levaes:</h5> 
              <h5 style="margin-left: auto;color: white;">{{leaveBalance.expired_leaves}}</h5>
            </div>
            <div style="display:flex; padding:10px;">
              <h5 style="color: white;">  Pending Leaves: </h5> 
              <h5 style="margin-left: auto;color: white;">{{leaveBalance.leaves_pending_approval}}</h5>
            </div>
            <div style="display:flex; padding:10px;">
              <h5 style="color: white;">  Available Leaves:</h5> 
              <h5 style="margin-left: auto;color: white;">{{leaveBalance.remaining_leaves}}</h5>
            </div>
          </div>
          <div v-if="leaveApplication.is_proof_document_required">
            <h5 style="color:#B87852;"> Proof Document:</h5>
            <input  class="upload-file" type="file"  @change="fetchFile($event)"/>
          </div>
          <div>
            <h5 style="color:white;"> From Date:</h5>
              <input :min="minDate" class="custom_input" type="date" id="fromDate" 
              style="width:90vw;" v-model="leaveApplication.from_date"
              pattern="\d{4}-\d{2}-\d{2}" @change="dateChange" />
          </div>
          <div >
            <h5 style="color:white;"> To Date:</h5>
            <input :min="minDate" class="custom_input" type="date" id="toDate" 
              v-model="leaveApplication.to_date"
              style="width:90vw;" pattern="\d{4}-\d{2}-\d{2}" @change="dateChange"/>
          </div>
          <div class="form_card" style="display:flex; color:white;" v-if="total_leave_days">
            <h5  style="color:white;"> Total Leave Days</h5> <h5 style="margin-left: auto;color:white">{{this.total_leave_days}}</h5> 
          </div>
          <div >
            <h5 style="color:white;"> Reason:</h5>
            <textarea v-model="leaveApplication.reason" id="reason" class="custom_input" 
            name="reason" rows="5" cols="45">
            </textarea>
          </div>
          <button @click="createLeave" style="background-color: #B87852;
            border-radius: 10px;padding: 10px; width: 95vw;" id="submitBTN"
            > Submit </button>
      </div>
    
      
      
    </div>
      <!-- * Transactions -->


      <!-- * App Capsule -->
  <!-- Body End -->

  <!-- Footer Start -->
  <Footer />
  <!-- Footer End -->

</template>

<style>
  .custom_input{
    line-height: 30px;
    padding: 2px;
    margin: 2px;  
    border: 2px solid #595c63;
    color: #595c63;
    background-color: white;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    -moz-transition: all 0.2s;
    -o-transition: all 0.2s;
    transition: all 0.2s;
    margin-left: auto;
  }
  
</style>